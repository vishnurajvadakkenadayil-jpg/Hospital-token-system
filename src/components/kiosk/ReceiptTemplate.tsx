
"use client";

import { PatientData } from "@/lib/types";

/**
 * ReceiptTemplate is a print-only component that formats the patient token for a thermal printer.
 * Layout: Hospital & Doctor on the left/top, Token number on the right.
 */
export function ReceiptTemplate({ data }: { data: PatientData }) {
  if (!data || !data.tokenNumber) return null;

  return (
    <div className="print-only fixed inset-0 z-[999] bg-white text-black p-6 font-mono w-[80mm] mx-auto border border-gray-200">
      <div className="flex justify-between items-start border-b-4 border-double border-black pb-4 mb-4">
        <div className="text-left space-y-1">
          <h1 className="text-xl font-bold uppercase leading-tight">VSNN Clinic</h1>
          <p className="text-sm font-bold border-t border-black pt-1">
            {data.doctorName}
          </p>
          <p className="text-[10px] mt-2">
            Date: {new Date().toLocaleDateString('en-IN')}
          </p>
          <p className="text-[10px]">
            Time: {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div className="text-right flex flex-col items-end">
          <span className="text-[10px] font-bold uppercase tracking-widest bg-black text-white px-1">Token</span>
          <h2 className="text-7xl font-black leading-none mt-1">{data.tokenNumber}</h2>
        </div>
      </div>

      <div className="text-left text-xs space-y-1 mb-4">
        <div className="flex justify-between border-b border-dotted border-gray-400 pb-1">
          <span className="font-bold">Patient:</span>
          <span className="uppercase">{data.name}</span>
        </div>
        <div className="flex justify-between border-b border-dotted border-gray-400 pb-1">
          <span className="font-bold">Mobile:</span>
          <span>{data.mobile}</span>
        </div>
        {data.place && (
          <div className="flex justify-between border-b border-dotted border-gray-400 pb-1">
            <span className="font-bold">Place:</span>
            <span>{data.place}</span>
          </div>
        )}
      </div>

      <div className="text-[10px] text-center italic border-t border-black pt-2">
        Please keep this receipt. Wait for your turn.
        <br />
        *** Thank You ***
      </div>
    </div>
  );
}
