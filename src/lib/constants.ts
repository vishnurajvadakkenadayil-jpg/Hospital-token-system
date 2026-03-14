
import { Doctor } from './types';

export const TRANSLATIONS = {
  en: {
    hospitalName: 'VSNN Clinic',
    selectLanguage: 'Choose Your Language',
    name: 'What is your name?',
    mobile: 'Mobile Number',
    place: 'Enter your place',
    healthIssue: 'What is your health issue?',
    confirm: 'Confirm',
    speakAgain: 'Speak Again',
    next: 'Next',
    selectDoctor: 'Select a Doctor',
    fullyBooked: 'Fully Booked',
    tokensBooked: 'Tokens Booked',
    tokenMessage: 'Your Token Number is:',
    waitMessage: 'Please wait for your token to be called.',
    processing: 'Processing voice...',
    tapToSpeak: 'Tap to Speak',
    errorVoice: 'Sorry, I couldn\'t hear you. Please try again.',
  },
  ml: {
    hospitalName: 'VSNN ക്ലിനിക്ക്',
    selectLanguage: 'ഭാഷ തിരഞ്ഞെടുക്കുക',
    name: 'നിങ്ങളുടെ പേര് എന്താണ്?',
    mobile: 'മൊബൈൽ നമ്പർ',
    place: 'നിങ്ങളുടെ സ്ഥലം നൽകുക',
    healthIssue: 'നിങ്ങളുടെ ആരോഗ്യപ്രശ്നം എന്താണ്?',
    confirm: 'സ്ഥിരീകരിക്കുക',
    speakAgain: 'വീണ്ടും പറയുക',
    next: 'അടുത്തത്',
    selectDoctor: 'ഒരു ഡോക്ടറെ തിരഞ്ഞെടുക്കുക',
    fullyBooked: 'ബുക്കിംഗ് പൂർത്തിയായി',
    tokensBooked: 'ടോക്കണുകൾ',
    tokenMessage: 'നിങ്ങളുടെ ടോക്കൺ നമ്പർ:',
    waitMessage: 'ദയവായി നിങ്ങളുടെ ടോക്കൺ വിളിക്കുന്നത് വരെ കാത്തിരിക്കുക.',
    processing: 'ശബ്ദം പ്രോസസ്സ് ചെയ്യുന്നു...',
    tapToSpeak: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    errorVoice: 'ക്ഷമിക്കണം, എനിക്ക് കേൾക്കാൻ കഴിഞ്ഞില്ല. ദയവായി വീണ്ടും ശ്രമിക്കുക.',
  }
};

// Doctors start with 0 bookings as requested, or small random numbers to look "live"
export const MOCK_DOCTORS: Doctor[] = [
  { id: '1', name: 'Dr. Rahul Sharma', specialty: 'General Physician', time: '09:00 AM - 01:00 PM', booked: 0, limit: 20 },
  { id: '2', name: 'Dr. Priya Nair', specialty: 'Pediatrician', time: '10:00 AM - 02:00 PM', booked: 0, limit: 20 },
  { id: '3', name: 'Dr. Thomas Kurian', specialty: 'Cardiologist', time: '04:00 PM - 08:00 PM', booked: 0, limit: 15 },
  { id: '4', name: 'Dr. Anjali Menon', specialty: 'Dermatologist', time: '11:00 AM - 03:00 PM', booked: 0, limit: 15 },
  { id: '5', name: 'Dr. Sreedhar K.', specialty: 'Orthopedic', time: '05:00 PM - 09:00 PM', booked: 0, limit: 20 },
];
