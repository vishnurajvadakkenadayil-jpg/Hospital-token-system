
"use client";

import { PatientData } from "@/lib/types";

/**
 * ReceiptTemplate is a print-only component that formats the patient token for a thermal printer.
 * Layout: 
 * - Hospital & Doctor on the top-left.
 * - Token number on the top-right (opposite side).
 * - Patient details clearly below the header section.
 */
export function ReceiptTemplate({ data }: { data: PatientData }) {
  if (!data || !data.tokenNumber) return null;

  return (
    <div className="print-only fixed inset-0 z-[999] bg-white text-black p-4 font-mono w-[80mm] mx-auto">
      {/* Header Section: Opposite sides for Clinic Info and Token */}
      <div className="flex justify-between items-start border-b-2 border-black pb-4 mb-4">
        <div className="text-left flex-1 pr-2">
          <h1 className="text-lg font-black uppercase leading-tight">VSNN Clinic</h1>
          <div className="mt-1 border-t border-black pt-1">
            <p className="text-xs font-bold">{data.doctorName}</p>
            <p className="text-[9px] text-gray-700 mt-1 uppercase">
              {new Date().toLocaleDateString('en-IN')} | {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
        
        <div className="text-right flex flex-col items-end border-l border-black pl-4">
          <span className="text-[10px] font-black uppercase tracking-tighter bg-black text-white px-2 py-0.5">TOKEN</span>
          <h2 className="text-6xl font-black leading-none mt-1">{data.tokenNumber}</h2>
        </div>
      </div>

      {/* Patient Section: Below the header */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-600 uppercase">Patient Name:</span>
          <span className="text-lg font-black uppercase border-b border-gray-300 pb-1">{data.name}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-600 uppercase">Mobile:</span>
            <span className="text-sm font-bold">{data.mobile}</span>
          </div>
          {data.place && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-600 uppercase">Place:</span>
              <span className="text-sm font-bold uppercase truncate">{data.place}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-4 border-t-2 border-dashed border-black">
        <p className="text-[11px] font-bold">PLEASE WAIT FOR YOUR TURN</p>
        <p className="text-[9px] mt-1 italic">*** Thank you for choosing VSNN ***</p>
        <div className="mt-2 text-[8px] opacity-50">Ref ID: {Date.now().toString().slice(-6)}</div>
      </div>
    </div>
  );
}
