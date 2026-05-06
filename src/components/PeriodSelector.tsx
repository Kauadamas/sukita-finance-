import React from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface PeriodSelectorProps {
  selectedMonth: number;
  selectedYear: number;
  onChange: (month: number, year: number) => void;
}

export function PeriodSelector({ selectedMonth, selectedYear, onChange }: PeriodSelectorProps) {
  const months = [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ];

  const handlePrevYear = () => onChange(selectedMonth, selectedYear - 1);
  const handleNextYear = () => onChange(selectedMonth, selectedYear + 1);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-1.5 rounded-2xl w-fit">
        <div className="flex items-center space-x-1 px-2">
          <Calendar size={16} className="text-brand-purple" />
          <button 
            onClick={handlePrevYear}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-bold min-w-[3rem] text-center">{selectedYear}</span>
          <button 
            onClick={handleNextYear}
            className="p-1 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
          >
            <ChevronRight size={16} />
          </button>
        </div>
        
        <div className="h-4 w-[1px] bg-white/10 mx-2" />

        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide max-w-[400px]">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => onChange(index, selectedYear)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                selectedMonth === index 
                  ? "bg-gradient-to-r from-brand-purple to-brand-orange text-white shadow-lg shadow-brand-purple/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              )}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
