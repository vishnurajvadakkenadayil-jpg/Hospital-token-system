
"use client";

import { Button } from "@/components/ui/button";
import { Delete, ArrowRight } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";

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
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto p-4">
      {/* Display */}
      <div className="w-full bg-white border-4 border-primary rounded-2xl p-6 text-center text-6xl font-bold tracking-[0.3em] h-28 flex items-center justify-center shadow-inner mb-4">
        {value || ".........."}
      </div>
      
      {/* Keypad */}
      <div className="grid grid-cols-3 gap-6 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-28 text-5xl font-black border-4 hover:bg-primary/10 hover:border-primary transition-all active:scale-95 rounded-2xl"
            onClick={() => handlePress(num.toString())}
          >
            {num}
          </Button>
        ))}
        
        {/* Bottom Row */}
        <Button
          variant="outline"
          className="h-28 text-2xl font-bold border-4 text-destructive hover:bg-destructive/10 transition-all active:scale-95 rounded-2xl"
          onClick={handleBackspace}
        >
          <Delete className="w-12 h-12" />
        </Button>
        
        <Button
          variant="outline"
          className="h-28 text-5xl font-black border-4 hover:bg-primary/10 hover:border-primary transition-all active:scale-95 rounded-2xl"
          onClick={() => handlePress("0")}
        >
          0
        </Button>
        
        <Button
          variant="default"
          className="h-28 text-3xl font-black bg-green-600 hover:bg-green-700 transition-all active:scale-95 rounded-2xl flex flex-col gap-1 uppercase"
          disabled={value.length !== 10}
          onClick={onConfirm}
        >
          <span>{t.next}</span>
          <ArrowRight className="w-8 h-8" />
        </Button>
      </div>
      
      {/* Helper text */}
      <p className="text-xl font-medium text-muted-foreground mt-4">
        {value.length}/10 {lang === 'en' ? 'digits entered' : 'അക്കങ്ങൾ നൽകി'}
      </p>
    </div>
  );
}
