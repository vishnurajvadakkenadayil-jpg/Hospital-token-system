
"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "./Header";
import { TRANSLATIONS, MOCK_DOCTORS } from "@/lib/constants";
import { Language, KioskStep, PatientData, Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Numpad } from "./Numpad";
import { Mic, Check, RotateCcw, ArrowRight } from "lucide-react";
import { malayalamSpeechToText } from "@/ai/flows/malayalam-voice-input";
import { ReceiptTemplate } from "./ReceiptTemplate";

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
  const [tempVoiceText, setTempVoiceText] = useState("");
  const [timer, setTimer] = useState(10);

  const t = TRANSLATIONS[lang];
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // Auto Reset Logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'CONFIRMATION') {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            resetKiosk();
            return 10;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const resetKiosk = () => {
    setStep('LANGUAGE');
    setPatientData({ name: '', mobile: '', place: '', healthIssue: '' });
    setTempVoiceText("");
    setTimer(10);
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
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result as string;
          setIsProcessing(true);
          try {
            const result = await malayalamSpeechToText({ audioDataUri: base64Audio });
            setTempVoiceText(result.recognizedText);
          } catch (err) {
            console.error(err);
            alert(t.errorVoice);
          } finally {
            setIsProcessing(false);
          }
        };
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic access denied", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
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

  const selectDoctor = (doc: Doctor) => {
    const token = Math.floor(Math.random() * 90) + 10; // Simulation: in real app, fetch sequential from DB
    setPatientData(prev => ({ 
      ...prev, 
      doctorName: doc.name, 
      tokenNumber: token,
      timestamp: Date.now() 
    }));
    setStep('CONFIRMATION');
    // Simulate Print
    setTimeout(() => {
      window.print();
    }, 500);
  };

  const renderContent = () => {
    switch (step) {
      case 'LANGUAGE':
        return (
          <div className="flex flex-col items-center justify-center gap-12 h-full">
            <h2 className="text-5xl font-bold text-foreground mb-4">Choose Your Language</h2>
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
          <div className="flex flex-col items-center gap-10 max-w-2xl mx-auto py-10">
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
                  <div className="animate-pulse text-2xl text-primary font-bold">{t.processing}</div>
                ) : tempVoiceText ? (
                  <div className="flex flex-col items-center gap-6 w-full">
                    <div className="bg-white border-4 border-primary rounded-2xl p-8 w-full text-center text-3xl font-bold min-h-[120px]">
                      {tempVoiceText}
                    </div>
                    <div className="flex gap-4 w-full">
                      <Button variant="outline" className="flex-1 h-20 text-2xl" onClick={() => setTempVoiceText("")}>
                        <RotateCcw className="mr-2" /> {t.speakAgain}
                      </Button>
                      <Button className="flex-1 h-20 text-2xl bg-green-600 hover:bg-green-700" onClick={() => confirmVoiceInput(field)}>
                        <Check className="mr-2" /> {t.confirm}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    className={`w-56 h-56 rounded-full shadow-2xl transition-all active:scale-90 ${isRecording ? 'bg-red-500 animate-bounce' : 'bg-primary'}`}
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                  >
                    <Mic className="w-24 h-24 text-white" />
                  </Button>
                )}
                {!tempVoiceText && !isProcessing && (
                  <p className="text-xl font-medium text-muted-foreground">{t.tapToSpeak}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'MOBILE':
        return (
          <div className="flex flex-col items-center gap-10 py-10">
            <h2 className="text-4xl font-bold">{t.mobile}</h2>
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
          <div className="w-full max-w-5xl mx-auto py-10">
            <h2 className="text-4xl font-bold text-center mb-10">{t.selectDoctor}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {MOCK_DOCTORS.map((doc) => {
                const isFull = doc.booked >= doc.limit;
                return (
                  <Button
                    key={doc.id}
                    variant="outline"
                    disabled={isFull}
                    onClick={() => selectDoctor(doc)}
                    className={`h-auto flex flex-col items-start p-6 text-left border-2 hover:border-primary transition-all relative ${isFull ? 'opacity-50 grayscale' : 'hover:bg-primary/5'}`}
                  >
                    <div className="flex justify-between w-full mb-2">
                      <h3 className="text-2xl font-bold text-foreground">{doc.name}</h3>
                      <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg text-sm">{doc.specialty}</span>
                    </div>
                    <p className="text-muted-foreground text-lg mb-4">{doc.time}</p>
                    <div className="flex items-center justify-between w-full mt-auto">
                      <span className="text-sm font-semibold">
                        {t.tokensBooked}: <span className={isFull ? 'text-destructive' : 'text-primary'}>{doc.booked} / {doc.limit}</span>
                      </span>
                      {isFull && <span className="text-destructive font-black uppercase text-xl">{t.fullyBooked}</span>}
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case 'CONFIRMATION':
        return (
          <div className="flex flex-col items-center justify-center gap-10 h-full py-20 animate-in fade-in zoom-in duration-500">
             <div className="bg-white border-8 border-green-500 rounded-full p-10 shadow-2xl">
               <Check className="w-32 h-32 text-green-500" />
             </div>
             <div className="text-center space-y-6">
               <h2 className="text-4xl font-bold text-muted-foreground">{t.tokenMessage}</h2>
               <div className="text-[12rem] font-black leading-none text-primary drop-shadow-lg">
                 {patientData.tokenNumber}
               </div>
               <p className="text-3xl font-medium text-foreground max-w-xl mx-auto">
                 {t.waitMessage}
               </p>
             </div>
             <div className="mt-10 text-muted-foreground font-bold">
               Returning to home in {timer} seconds...
             </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header lang={lang} />
      <main className="flex-1 overflow-y-auto px-6 no-print">
        {renderContent()}
      </main>
      <ReceiptTemplate data={patientData} />
    </div>
  );
}
