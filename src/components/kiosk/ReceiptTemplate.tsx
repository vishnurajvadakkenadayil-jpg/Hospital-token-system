"use client";

import { PatientData } from "@/lib/types";

/**
 * ReceiptTemplate is a print-only component that formats the patient token for a thermal printer (80mm).
 * Layout: 
 * - Clinic & Doctor Info: Top Left
 * - Token Number: Top Right (Opposite side)
 * - Patient Name: Below the header
 */
export function ReceiptTemplate({ data }: { data: PatientData }) {
  if (!data || !data.tokenNumber) return null;

  return (
    <div className="print-only bg-white text-black p-4 font-sans w-[80mm] mx-auto min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        {/* Top Left: Hospital & Doctor */}
        <div className="text-left flex-1">
          <h1 className="text-xl font-black uppercase leading-none mb-1">VSNN Clinic</h1>
          <p className="text-sm font-bold border-t border-black mt-1 pt-1">{data.doctorName}</p>
          <div className="text-[10px] mt-1 space-y-0.5 opacity-80">
            <p>{new Date().toLocaleDateString('en-IN')}</p>
            <p>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
        
        {/* Top Right: Token Number */}
        <div className="text-right flex flex-col items-end border-l-2 border-black pl-4 min-w-[100px]">
          <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5 tracking-tighter">TOKEN</span>
          <h2 className="text-7xl font-black leading-none mt-1">{data.tokenNumber}</h2>
        </div>
      </div>

      {/* Patient Section: Clearly below the header */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Patient Name:</span>
          <span className="text-2xl font-black uppercase border-b border-gray-400 pb-1">{data.name}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-700 uppercase">Mobile:</span>
            <span className="text-sm font-bold">{data.mobile}</span>
          </div>
          {data.place && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-700 uppercase">Place:</span>
              <span className="text-sm font-bold uppercase truncate">{data.place}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-6 border-t-2 border-dashed border-black">
        <p className="text-xs font-black uppercase tracking-widest">PLEASE WAIT FOR YOUR TURN</p>
        <p className="text-[10px] mt-2 italic font-bold">*** Thank you for choosing VSNN ***</p>
        <div className="mt-4 text-[8px] opacity-40">Ref: {Date.now().toString().slice(-8)}</div>
      </div>
    </div>
  );
}