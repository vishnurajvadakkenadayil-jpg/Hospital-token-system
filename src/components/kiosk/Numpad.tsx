
"use client";

import { Button } from "@/components/ui/button";
import { Delete, ArrowRight } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface NumpadProps {
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  lang: 'en' | 'ml';
}

export function Numpad({ value, onChange, onConfirm, lang }: NumpadProps) {
  const t = TRANSLATIONS[lang];

  const handlePress = (num: string) => {
    if (value.length < 10) {
      onChange(value + num);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-xl mx-auto p-4">
      {/* Mobile Number Display */}
      <div className="w-full bg-white border-4 border-primary rounded-2xl p-6 text-center text-5xl font-black tracking-[0.2em] h-24 flex items-center justify-center shadow-inner mb-2 overflow-hidden">
        {value || ".........."}
      </div>
      
      {/* Large 3x4 Grid Keypad */}
      <div className="grid grid-cols-3 gap-4 w-full">
        {/* Digits 1-9 */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-24 text-5xl font-black border-4 hover:bg-primary/10 hover:border-primary transition-all active:scale-95 rounded-2xl"
            onClick={() => handlePress(num.toString())}
          >
            {num}
          </Button>
        ))}
        
        {/* Bottom Row: Clear/Backspace, Zero, Next */}
        <Button
          variant="outline"
          className="h-24 border-4 text-destructive hover:bg-destructive/10 transition-all active:scale-95 rounded-2xl flex items-center justify-center"
          onClick={handleBackspace}
          title="Clear"
        >
          <Delete className="w-12 h-12" />
        </Button>
        
        <Button
          variant="outline"
          className="h-24 text-5xl font-black border-4 hover:bg-primary/10 hover:border-primary transition-all active:scale-95 rounded-2xl"
          onClick={() => handlePress("0")}
        >
          0
        </Button>
        
        <Button
          variant="default"
          className={cn(
            "h-24 text-2xl font-black transition-all active:scale-95 rounded-2xl flex flex-col gap-1 uppercase",
            value.length === 10 
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg" 
              : "bg-muted text-muted-foreground opacity-50 cursor-not-allowed"
          )}
          onClick={() => {
            if (value.length === 10) onConfirm();
          }}
        >
          <span>{t.next}</span>
          <ArrowRight className="w-8 h-8" />
        </Button>
      </div>
      
      {/* Progress Helper */}
      <p className="text-xl font-bold text-muted-foreground mt-2">
        {value.length}/10 {lang === 'en' ? 'digits' : 'അക്കങ്ങൾ'}
      </p>
    </div>
  );
}
