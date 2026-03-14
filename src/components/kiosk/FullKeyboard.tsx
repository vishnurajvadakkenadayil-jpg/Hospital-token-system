"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Delete, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface FullKeyboardProps {
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  label: string;
}

export function FullKeyboard({ value, onChange, onConfirm, label }: FullKeyboardProps) {
  const [isCaps, setIsCaps] = useState(true);

  const rows = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const handlePress = (char: string) => {
    const nextChar = isCaps ? char.toUpperCase() : char.toLowerCase();
    onChange(value + nextChar);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-4xl mx-auto p-4 bg-secondary/20 rounded-3xl border shadow-inner">
      {/* Display Area */}
      <div className="w-full flex flex-col gap-2 mb-2">
        <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest px-2">
          {label}
        </label>
        <div className="w-full bg-white border-4 border-primary/20 rounded-2xl p-6 text-3xl font-bold min-h-[80px] flex items-center shadow-sm">
          {value}
          <span className="w-1 h-8 bg-primary animate-pulse ml-1" />
        </div>
      </div>

      {/* Keyboard Grid */}
      <div className="flex flex-col gap-2 w-full">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2">
            {rowIndex === 3 && (
              <Button
                variant={isCaps ? "default" : "outline"}
                className={cn(
                  "h-16 w-20 text-xl rounded-xl border-2 transition-all active:scale-95",
                  isCaps && "bg-primary text-white"
                )}
                onClick={() => setIsCaps(!isCaps)}
              >
                <ArrowUp className="w-8 h-8" />
              </Button>
            )}
            
            {row.map((char) => (
              <Button
                key={char}
                variant="outline"
                className="h-16 flex-1 text-2xl font-bold rounded-xl border-2 hover:bg-primary/10 hover:border-primary transition-all active:scale-95 bg-white"
                onClick={() => handlePress(char)}
              >
                {isCaps ? char.toUpperCase() : char.toLowerCase()}
              </Button>
            ))}

            {rowIndex === 3 && (
              <Button
                variant="outline"
                className="h-16 w-24 text-xl rounded-xl border-2 hover:bg-destructive/10 hover:border-destructive text-destructive transition-all active:scale-95 bg-white"
                onClick={handleBackspace}
              >
                <Delete className="w-8 h-8" />
              </Button>
            )}
          </div>
        ))}

        {/* Bottom Row */}
        <div className="flex justify-center gap-2 mt-2">
          <Button
            variant="outline"
            className="h-16 w-32 text-xl font-bold rounded-xl border-2 bg-white"
            onClick={() => onChange("")}
          >
            Clear
          </Button>
          <Button
            variant="outline"
            className="h-16 flex-[3] text-2xl font-bold rounded-xl border-2 bg-white"
            onClick={() => onChange(value + " ")}
          >
            Space
          </Button>
          <Button
            disabled={!value.trim()}
            className="h-16 flex-1 text-2xl font-black rounded-xl shadow-lg bg-green-600 hover:bg-green-700 text-white uppercase flex items-center justify-center gap-2"
            onClick={onConfirm}
          >
            Next <ArrowRight className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
