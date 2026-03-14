
"use client";

import { PatientData } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * ReceiptTemplate formats the patient token for a thermal printer (80mm) or UI preview.
 * Layout: 
 * - Clinic & Doctor Info: Top Left
 * - Token Number: Top Right (Opposite side)
 * - Patient Name: Below the header
 */
export function ReceiptTemplate({ data, isPreview = false }: { data: PatientData, isPreview?: boolean }) {
  if (!data || !data.tokenNumber) return null;

  return (
    <div className={cn(
      "bg-white text-black p-4 font-sans w-[80mm] mx-auto",
      !isPreview && "print-only min-h-screen"
    )}>
      {/* Header Section */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        {/* Top Left: Hospital & Doctor */}
        <div className="text-left flex-1 pr-2">
          <h1 className="text-lg font-black uppercase leading-tight mb-1">VSNN Clinic</h1>
          <p className="text-xs font-bold border-t border-black mt-1 pt-1 leading-tight">{data.doctorName}</p>
          <div className="text-[9px] mt-1 space-y-0.5 opacity-80 font-bold">
            <p>{new Date().toLocaleDateString('en-IN')}</p>
            <p>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        
        {/* Top Right: Token Number (Opposite side) */}
        <div className="text-right flex flex-col items-end border-l border-black pl-3 min-w-[80px]">
          <span className="text-[9px] font-black uppercase bg-black text-white px-2 py-0.5 tracking-tighter">TOKEN</span>
          <h2 className="text-6xl font-black leading-none mt-1">{data.tokenNumber}</h2>
        </div>
      </div>

      {/* Patient Section: Clearly below the header */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-widest">Patient Name:</span>
          <span className="text-xl font-black uppercase border-b border-gray-400 pb-1 truncate">{data.name}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-gray-700 uppercase">Mobile:</span>
            <span className="text-xs font-bold">{data.mobile}</span>
          </div>
          {data.place && (
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-gray-700 uppercase">Place:</span>
              <span className="text-xs font-bold uppercase truncate">{data.place}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t-2 border-dashed border-black">
        <p className="text-[10px] font-black uppercase tracking-widest">PLEASE WAIT FOR YOUR TURN</p>
        <p className="text-[9px] mt-1 italic font-bold">*** Thank you for choosing VSNN ***</p>
        <div className="mt-3 text-[8px] opacity-40">Ref: {Date.now().toString().slice(-8)}</div>
      </div>
    </div>
  );
}
