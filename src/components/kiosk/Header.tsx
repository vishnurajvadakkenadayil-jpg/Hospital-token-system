
"use client";

import { Cross } from "lucide-react";
import { TRANSLATIONS } from "@/lib/constants";
import { Language } from "@/lib/types";

export function Header({ lang }: { lang: Language }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  
  return (
    <header className="w-full bg-white border-b-4 border-primary py-6 px-10 flex items-center justify-between shadow-sm no-print">
      <div className="flex items-center gap-4">
        <div className="bg-primary p-3 rounded-full">
          <Cross className="w-8 h-8 text-white fill-white" />
        </div>
        <h1 className="text-4xl font-bold text-foreground tracking-tight uppercase">
          {t.hospitalName}
        </h1>
      </div>
      <div className="text-muted-foreground font-medium text-lg">
        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      </div>
    </header>
  );
}
