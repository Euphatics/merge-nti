import { Check } from 'lucide-react';

export default function ProgressStepper({ currentStage }) {
  const steps = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Registration' },
    { num: 3, label: 'Payment' },
    { num: 4, label: 'Verification' },
    { num: 5, label: 'Admit Cards' }
  ];

  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-sm p-4 sm:p-6 mb-6 shadow-sm overflow-x-auto">
      <div className="min-w-[600px] flex items-center justify-between relative">
        
        {/* Background connector line */}
        <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-100 -z-0 -translate-y-1/2"></div>
        
        {/* Active connector line */}
        <div 
          className="absolute top-1/2 left-0 h-[2px] bg-[#007BFF] -z-0 -translate-y-1/2 transition-all duration-500 ease-in-out"
          style={{ width: `${(Math.min(currentStage - 1, steps.length - 1) / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => {
          const isCompleted = currentStage > step.num;
          const isActive = currentStage === step.num;
          const isPending = currentStage < step.num;

          return (
            <div key={step.num} className="relative z-10 flex flex-col items-center bg-white px-2">
              <div 
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 text-[12px] sm:text-[14px] font-bold transition-colors
                  ${isCompleted ? 'bg-[#007BFF] border-[#007BFF] text-white' : ''}
                  ${isActive ? 'bg-white border-[#007BFF] text-[#007BFF]' : ''}
                  ${isPending ? 'bg-white border-gray-200 text-gray-400' : ''}
                `}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : step.num}
              </div>
              <span 
                className={`mt-2 text-[11px] sm:text-[12px] font-bold uppercase tracking-wider transition-colors
                  ${isCompleted || isActive ? 'text-[#1F2937]' : 'text-[#9CA3AF]'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
        
      </div>
    </div>
  );
}
