export type Language = 'en' | 'ml';

export interface PatientData {
  name: string;
  mobile: string;
  place: string;
  healthIssue: string;
  doctorName?: string;
  doctorId?: string;
  tokenNumber?: number;
  timestamp?: number | any;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  time: string;
  booked: number;
  limit: number;
}

export type KioskStep = 
  | 'LANGUAGE'
  | 'NAME'
  | 'MOBILE'
  | 'PLACE'
  | 'HEALTH_ISSUE'
  | 'DOCTOR_SELECT'
  | 'CONFIRMATION';
