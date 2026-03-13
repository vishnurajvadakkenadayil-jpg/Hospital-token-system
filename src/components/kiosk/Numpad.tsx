
"use client";

import { Button } from "@/components/ui/button";
import { Delete, Check } from "lucide-react";

interface NumpadProps {
  value: string;
  onChange: (val: string) => void;
  onConfirm: () => void;
  lang: 'en' | 'ml';
}

export function Numpad({ value, onChange, onConfirm, lang }: NumpadProps) {
  const handlePress = (num: string) => {
    if (value.length < 10) {
      onChange(value + num);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto">
      <div className="w-full bg-white border-2 border-primary rounded-xl p-4 text-center text-4xl font-bold tracking-[0.2em] h-20 flex items-center justify-center shadow-inner">
        {value || ".........."}
      </div>
      
      <div className="grid grid-cols-3 gap-4 w-full">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Button
            key={num}
            variant="outline"
            className="h-24 text-4xl font-bold border-2 hover:bg-primary/10 hover:border-primary transition-all active:scale-95"
            onClick={() => handlePress(num.toString())}
          >
            {num}
          </Button>
        ))}
        
        <Button
          variant="outline"
          className="h-24 text-2xl font-bold border-2 text-destructive hover:bg-destructive/10 transition-all active:scale-95"
          onClick={handleBackspace}
        >
          <Delete className="w-10 h-10" />
        </Button>
        
        <Button
          variant="outline"
          className="h-24 text-4xl font-bold border-2 hover:bg-primary/10 hover:border-primary transition-all active:scale-95"
          onClick={() => handlePress("0")}
        >
          0
        </Button>
        
        <Button
          variant="default"
          className="h-24 text-2xl font-bold bg-green-600 hover:bg-green-700 transition-all active:scale-95"
          disabled={value.length !== 10}
          onClick={onConfirm}
        >
          <Check className="w-10 h-10" />
        </Button>
      </div>
    </div>
  );
}
