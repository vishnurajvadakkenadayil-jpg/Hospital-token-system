
"use client";

import { PatientData } from "@/lib/types";

export function ReceiptTemplate({ data }: { data: PatientData }) {
  if (!data) return null;

  return (
    <div className="print-only fixed inset-0 z-[999] bg-white text-black p-8 font-mono text-center w-[80mm] mx-auto">
      <div className="border-b-2 border-dashed border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold uppercase">VSNN Clinic</h1>
        <p className="text-sm">Patient Token Receipt</p>
      </div>

      <div className="mb-4">
        <p className="text-sm">Token Number</p>
        <h2 className="text-6xl font-black my-2">{data.tokenNumber}</h2>
      </div>

      <div className="text-left space-y-2 border-b-2 border-dashed border-black pb-4 mb-4">
        <div className="flex justify-between">
          <span className="font-bold">Patient:</span>
          <span>{data.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Doctor:</span>
          <span>{data.doctorName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Date:</span>
          <span>{new Date().toLocaleDateString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-bold">Time:</span>
          <span>{new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="text-xs italic">
        Please wait for your turn. Thank you!
      </div>
    </div>
  );
}
