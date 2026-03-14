
"use client";

import { PatientData } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * ReceiptTemplate formats the patient token as an A4 prescription pad.
 * Layout: 
 * - Clinic & Doctor Info: Top Left
 * - Token Number: Top Right
 * - Patient Details: Below Header
 * - Prescription Area: Large blank space (more than half the page)
 */
export function ReceiptTemplate({ data, isPreview = false }: { data: PatientData, isPreview?: boolean }) {
  if (!data || !data.tokenNumber) return null;

  return (
    <div className={cn(
      "bg-white text-black p-8 font-sans mx-auto flex flex-col",
      isPreview ? "w-full max-w-[210mm] shadow-inner border border-gray-200" : "print-only w-full min-h-screen"
    )}>
      {/* Header Section */}
      <div className="flex justify-between items-start border-b-4 border-black pb-6 mb-6">
        {/* Top Left: Hospital & Doctor */}
        <div className="text-left flex-1 pr-4">
          <h1 className="text-3xl font-black uppercase leading-tight mb-2 tracking-tighter">VSNN Clinic</h1>
          <p className="text-xl font-bold border-t-2 border-black mt-2 pt-2 leading-tight">
            {data.doctorName}
          </p>
          <div className="text-sm mt-2 space-y-1 opacity-80 font-bold">
            <p>Date: {new Date().toLocaleDateString('en-IN')}</p>
            <p>Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        
        {/* Top Right: Token Number */}
        <div className="text-right flex flex-col items-end border-l-4 border-black pl-6 min-w-[120px]">
          <span className="text-xs font-black uppercase bg-black text-white px-3 py-1 tracking-widest mb-1">TOKEN</span>
          <h2 className="text-8xl font-black leading-none">{data.tokenNumber}</h2>
        </div>
      </div>

      {/* Patient Section */}
      <div className="grid grid-cols-2 gap-8 mb-10 border-b-2 border-gray-200 pb-6">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Patient Name</span>
          <span className="text-2xl font-black uppercase">{data.name}</span>
        </div>
        
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mobile / Place</span>
          <span className="text-lg font-bold">
            {data.mobile} {data.place ? ` | ${data.place}` : ''}
          </span>
        </div>
      </div>

      {/* Prescription / Notes Area (Blank Space) */}
      <div className="flex-1 flex flex-col border-2 border-dashed border-gray-100 rounded-lg p-4">
        <div className="text-2xl font-black text-gray-200 italic mb-4">Rx / Notes</div>
        {/* This div provides the large blank space for writing */}
        <div className="min-h-[18cm] w-full"></div>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 border-t-2 border-black">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <p className="text-xs font-black uppercase tracking-widest">PLEASE WAIT FOR YOUR TURN</p>
            <p className="text-xs mt-1 italic font-bold">Thank you for choosing VSNN Clinic</p>
          </div>
          <div className="text-right">
            <div className="h-16 w-32 border-b border-black mb-1"></div>
            <p className="text-[10px] font-bold uppercase">Doctor's Signature</p>
          </div>
        </div>
        <div className="mt-4 text-[10px] opacity-30 text-center">Ref: {Date.now().toString()}</div>
      </div>
    </div>
  );
}
