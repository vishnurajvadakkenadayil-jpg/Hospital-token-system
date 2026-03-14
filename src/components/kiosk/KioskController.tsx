"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./Header";
import { TRANSLATIONS, MOCK_DOCTORS } from "@/lib/constants";
import { Language, KioskStep, PatientData, Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Numpad } from "./Numpad";
import { Mic, Check, RotateCcw, ArrowRight, ArrowLeft, Loader2, Printer, X } from "lucide-react";
import { malayalamSpeechToText } from "@/ai/flows/malayalam-voice-input";
import { ReceiptTemplate } from "./ReceiptTemplate";
import { 
  collection, 
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { useFirestore, useAuth, useUser } from "@/firebase";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function KioskController() {
  const [step, setStep] = useState<KioskStep>('LANGUAGE');
  const [lang, setLang] = useState<Language>('en');
  const [patientData, setPatientData] = useState<PatientData>({
    name: '',
    mobile: '',
    place: '',
    healthIssue: '',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [tempVoiceText, setTempVoiceText] = useState("");
  const [timer, setTimer] = useState(60); 
  const [showReceipt, setShowReceipt] = useState(false);
  
  // Local state for live doctor counts to ensure responsiveness
  const [liveDoctors, setLiveDoctors] = useState<Doctor[]>(MOCK_DOCTORS);

  const db = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  // Auto-sign in for Firestore permissions
  useEffect(() => {
    if (auth && !user) {
      signInAnonymously(auth).catch((err) => {
        console.error("Auth error:", err);
      });
    }
  }, [auth, user]);

  // Reset timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'CONFIRMATION' && !showReceipt) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            resetKiosk();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, showReceipt]);

  const resetKiosk = () => {
    setStep('LANGUAGE');
    setPatientData({ name: '', mobile: '', place: '', healthIssue: '' });
    setTempVoiceText("");
    setTimer(60);
    setIsBooking(null);
    setShowReceipt(false);
    stopRecording();
  };

  const goBack = () => {
    if (step === 'NAME') setStep('LANGUAGE');
    else if (step === 'MOBILE') setStep('NAME');
    else if (step === 'PLACE') setStep('MOBILE');
    else if (step === 'HEALTH_ISSUE') setStep('PLACE');
    else if (step === 'DOCTOR_SELECT') setStep('HEALTH_ISSUE');
    setTempVoiceText("");
  };

  const handleLangSelect = (l: Language) => {
    setLang(l);
    setStep('NAME');
  };

  const updateData = (field: keyof PatientData, val: string) => {
    setPatientData(prev => ({ ...prev, [field]: val }));
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const formats = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      const mimeType = formats.find(f => MediaRecorder.isTypeSupported(f)) || 'audio/webm';
        
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        if (chunksRef.current.length === 0) {
          setIsProcessing(false);
          return;
        }

        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsProcessing(true);
          try {
            const result = await malayalamSpeechToText({ audioDataUri: base64Audio });
            if (result && result.recognizedText) {
              setTempVoiceText(result.recognizedText);
            }
          } catch (err) {
            console.error("Transcription error:", err);
          } finally {
            setIsProcessing(false);
          }
        };

        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access error", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  const confirmVoiceInput = (field: keyof PatientData) => {
    updateData(field, tempVoiceText);
    setTempVoiceText("");
    moveToNextStep(field);
  };

  const moveToNextStep = (currentField: keyof PatientData) => {
    if (currentField === 'name') setStep('MOBILE');
    else if (currentField === 'mobile') setStep('PLACE');
    else if (currentField === 'place') setStep('HEALTH_ISSUE');
    else if (currentField === 'healthIssue') setStep('DOCTOR_SELECT');
  };

  const handlePrintClick = () => {
    setShowReceipt(true);
    // Auto-trigger print after short delay to allow dialog rendering
    setTimeout(() => {
      window.print();
    }, 700);
  };

  const selectDoctor = (doctor: Doctor) => {
    setIsBooking(doctor.id);
    const newTokenNumber = (doctor.booked || 0) + 1;

    // Update local UI immediately
    setLiveDoctors(prev => prev.map(d => 
      d.id === doctor.id ? { ...d, booked: newTokenNumber } : d
    ));

    const finalPatientData = {
      ...patientData,
      doctorName: doctor.name,
      doctorId: doctor.id,
      tokenNumber: newTokenNumber,
      timestamp: Date.now()
    };
    setPatientData(finalPatientData);

    // Save record to database
    if (db) {
      addDoc(collection(db, "tokens"), {
        ...finalPatientData,
        timestamp: serverTimestamp(),
      }).catch(err => console.error("Firestore save error:", err));
    }

    setStep('CONFIRMATION');
    setIsBooking(null);
  };

  const renderContent = () => {
    switch (step) {
      case 'LANGUAGE':
        return (
          <div className="flex flex-col items-center justify-center gap-12 h-full">
            <h2 className="text-5xl font-bold text-foreground mb-4">{t.selectLanguage}</h2>
            <div className="flex gap-8">
              <Button 
                onClick={() => handleLangSelect('en')}
                className="w-80 h-48 text-4xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                English
              </Button>
              <Button 
                onClick={() => handleLangSelect('ml')}
                className="w-80 h-48 text-4xl font-bold shadow-lg hover:scale-105 transition-transform"
              >
                മലയാളം
              </Button>
            </div>
          </div>
        );

      case 'NAME':
      case 'PLACE':
      case 'HEALTH_ISSUE':
        const fieldMap: Record<string, keyof PatientData> = {
          'NAME': 'name',
          'PLACE': 'place',
          'HEALTH_ISSUE': 'healthIssue'
        };
        const field = fieldMap[step];
        const currentVal = patientData[field];

        return (
          <div className="flex flex-col items-center gap-6 max-w-2xl mx-auto py-6 w-full h-full">
             <div className="w-full flex justify-start">
               <Button variant="ghost" className="text-xl font-bold gap-2" onClick={goBack}>
                 <ArrowLeft /> {lang === 'en' ? 'Back' : 'തിരികെ'}
               </Button>
             </div>
             
            <h2 className="text-4xl font-bold text-center">{t[field as keyof typeof t]}</h2>
            
            {lang === 'en' ? (
              <div className="w-full flex flex-col gap-6">
                <Input 
                  autoFocus
                  className="h-20 text-3xl px-6 text-center border-4"
                  value={String(currentVal)}
                  onChange={(e) => updateData(field, e.target.value)}
                  placeholder="..."
                />
                <Button 
                  className="h-20 text-2xl font-bold" 
                  disabled={!currentVal}
                  onClick={() => moveToNextStep(field)}
                >
                  {t.next} <ArrowRight className="ml-2 w-8 h-8" />
                </Button>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center gap-8">
                {isProcessing ? (
                  <div className="flex flex-col items-center gap-6 p-10 bg-white rounded-3xl border-4 border-dashed border-primary animate-pulse">
                    <Loader2 className="h-20 w-20 text-primary animate-spin" />
                    <div className="text-3xl text-primary font-black uppercase tracking-widest">{t.processing}</div>
                  </div>
                ) : tempVoiceText ? (
                  <div className="flex flex-col items-center gap-6 w-full">
                    <div className="bg-white border-4 border-primary rounded-2xl p-8 w-full text-center text-4xl font-bold min-h-[140px] shadow-lg flex items-center justify-center">
                      {tempVoiceText}
                    </div>
                    <div className="flex gap-4 w-full">
                      <Button variant="outline" className="flex-1 h-24 text-2xl border-2" onClick={() => setTempVoiceText("")}>
                        <RotateCcw className="mr-2" /> {t.speakAgain}
                      </Button>
                      <Button className="flex-1 h-24 text-2xl bg-green-600 hover:bg-green-700 shadow-md" onClick={() => confirmVoiceInput(field)}>
                        <Check className="mr-2" /> {t.confirm}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-10">
                    <Button 
                      className={`w-64 h-64 rounded-full shadow-2xl transition-all active:scale-90 ${isRecording ? 'bg-red-500 scale-110 ring-8 ring-red-200' : 'bg-primary hover:bg-primary/90'}`}
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                    >
                      <Mic className={`w-32 h-32 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                    </Button>
                    <div className="text-center space-y-2">
                      <p className="text-3xl font-black text-foreground">
                        {isRecording ? (lang === 'en' ? 'Listening...' : 'ശ്രദ്ധിക്കുന്നു...') : t.tapToSpeak}
                      </p>
                      {!isRecording && <p className="text-xl text-muted-foreground font-bold">(Hold to talk)</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 'MOBILE':
        return (
          <div className="flex flex-col items-center gap-2 py-2 w-full max-w-3xl mx-auto h-full">
             <div className="w-full flex justify-start px-4">
               <Button variant="ghost" className="text-xl font-bold gap-2" onClick={goBack}>
                 <ArrowLeft /> {lang === 'en' ? 'Back' : 'തിരികെ'}
               </Button>
             </div>
            <h2 className="text-3xl font-bold">{t.mobile}</h2>
            <Numpad 
              value={patientData.mobile} 
              onChange={(val) => updateData('mobile', val)} 
              onConfirm={() => moveToNextStep('mobile')}
              lang={lang}
            />
          </div>
        );

      case 'DOCTOR_SELECT':
        return (
          <div className="w-full max-w-5xl mx-auto py-6 px-4">
            <div className="w-full flex justify-start mb-2">
               <Button variant="ghost" className="text-xl font-bold gap-2" onClick={goBack}>
                 <ArrowLeft /> {lang === 'en' ? 'Back' : 'തിരികെ'}
               </Button>
             </div>
            <h2 className="text-3xl font-bold text-center mb-6">{t.selectDoctor}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveDoctors.map((doc) => {
                const isFull = (doc.booked || 0) >= doc.limit;
                const loadingThis = isBooking === doc.id;
                
                return (
                  <Button
                    key={doc.id}
                    variant="outline"
                    disabled={isFull || !!isBooking}
                    onClick={() => selectDoctor(doc)}
                    className={`h-auto flex flex-col items-start p-4 text-left border-2 hover:border-primary transition-all relative ${isFull ? 'opacity-50 grayscale' : 'hover:bg-primary/5 shadow-sm'}`}
                  >
                    {loadingThis && (
                      <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-md z-10">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    )}
                    <div className="flex justify-between w-full mb-1">
                      <h3 className="text-xl font-bold text-foreground">{doc.name}</h3>
                      <span className="text-primary font-bold bg-primary/10 px-2 py-0.5 rounded text-xs">{doc.specialty}</span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">{doc.time}</p>
                    <div className="flex items-center justify-between w-full mt-auto">
                      <span className="text-xs font-semibold">
                        {t.tokensBooked}: <span className={isFull ? 'text-destructive' : 'text-primary'}>{doc.booked || 0} / {doc.limit}</span>
                      </span>
                      {isFull && <span className="text-destructive font-black uppercase text-sm">{t.fullyBooked}</span>}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 'CONFIRMATION':
        return (
          <div className="flex flex-col items-center gap-8 h-full py-10 animate-in fade-in zoom-in duration-500 max-w-4xl mx-auto w-full">
             <div className="text-center space-y-4">
               <h2 className="text-4xl font-bold text-green-600 flex items-center justify-center gap-3">
                 <Check className="w-12 h-12" /> Booking Successful!
               </h2>
               <p className="text-2xl font-medium text-muted-foreground">
                 Click the button below to issue your prescription/token.
               </p>
             </div>
             
             <div className="flex flex-col gap-4 w-full max-w-md">
               <Button 
                onClick={handlePrintClick} 
                size="lg" 
                className="h-32 px-8 text-4xl font-black bg-primary hover:bg-primary/90 shadow-xl flex gap-4 uppercase rounded-3xl"
               >
                 <Printer className="w-12 h-12" /> {lang === 'en' ? 'Print Receipt' : 'റസീപ്റ്റ് പ്രിന്റ് ചെയ്യുക'}
               </Button>
               
               <Button onClick={resetKiosk} variant="ghost" className="h-14 text-xl font-bold text-muted-foreground">
                 Skip & Finish
               </Button>
             </div>

             {!showReceipt && (
               <div className="mt-4 text-muted-foreground font-bold">
                 {`Resetting in ${timer}s`}
               </div>
             )}

             {/* A4 Prescription Popup Dialog */}
             <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
               <DialogContent className="max-w-[90vw] md:max-w-[70vw] h-[90vh] p-0 border-none bg-white overflow-hidden shadow-2xl rounded-2xl">
                 <div className="flex flex-col h-full bg-gray-100">
                    <div className="bg-white border-b p-4 flex justify-between items-center no-print">
                      <h3 className="text-xl font-bold">Prescription Preview</h3>
                      <Button variant="ghost" size="icon" onClick={() => setShowReceipt(false)}>
                        <X className="w-6 h-6" />
                      </Button>
                    </div>
                    
                    <ScrollArea className="flex-1 p-4 md:p-10">
                      <div className="max-w-[210mm] mx-auto bg-white shadow-lg overflow-hidden">
                        <ReceiptTemplate data={patientData} isPreview={true} />
                      </div>
                    </ScrollArea>
                    
                    <div className="bg-white border-t p-6 flex gap-4 no-print">
                      <Button 
                        onClick={() => window.print()}
                        variant="outline"
                        className="flex-1 h-16 text-xl font-bold border-2"
                      >
                        <Printer className="mr-2" /> Re-Print
                      </Button>
                      <Button 
                        onClick={resetKiosk} 
                        className="flex-1 h-16 text-2xl font-bold bg-green-600 hover:bg-green-700"
                      >
                        Done / ശരി
                      </Button>
                    </div>
                 </div>
               </DialogContent>
             </Dialog>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header lang={lang} />
      <main className="flex-1 overflow-y-auto px-4 no-print flex flex-col items-center">
        {renderContent()}
      </main>
      {/* Real print-only version used by browser for A4 paper */}
      <ReceiptTemplate data={patientData} />
    </div>
  );
}
