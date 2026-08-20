import { ShieldCheck, AlertCircle, Clock, Lock, CheckCircle2, CircleDashed } from 'lucide-react';

export default function SchoolVerificationTab({ currentStage, paymentStatus, isListLocked }) {
  const isLocked = currentStage < 4;

  if (isLocked) {
    return (
      <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Lock size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937] mb-2">Verification Locked</h3>
        <p className="text-[14px] text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
          You must complete your fee payment in the <strong>Payment</strong> tab before your submission can be sent for verification.
        </p>
      </div>
    );
  }

  const renderChecklist = () => (
    <div className="mt-8 w-full max-w-md mx-auto space-y-3 text-left">
      <div className={`flex items-center justify-between p-4 rounded-sm border ${paymentStatus === 'verified' ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          {paymentStatus === 'verified' ? (
            <CheckCircle2 size={20} className="text-emerald-600" />
          ) : (
            <CircleDashed size={20} className="text-amber-500 animate-[spin_3s_linear_infinite]" />
          )}
          <div>
            <p className="text-[14px] font-bold text-[#1F2937]">Payment Verification</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{paymentStatus === 'verified' ? 'Successfully processed' : 'Under administrative review'}</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${paymentStatus === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {paymentStatus === 'verified' ? 'Verified' : 'Pending'}
        </span>
      </div>

      <div className={`flex items-center justify-between p-4 rounded-sm border ${isListLocked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-3">
          {isListLocked ? (
            <CheckCircle2 size={20} className="text-emerald-600" />
          ) : (
            <CircleDashed size={20} className="text-amber-500 animate-[spin_3s_linear_infinite]" />
          )}
          <div>
            <p className="text-[14px] font-bold text-[#1F2937]">Student Details Verification</p>
            <p className="text-[12px] text-[#9CA3AF] mt-0.5">{isListLocked ? 'Lists are locked and verified' : 'Verifying format and constraints'}</p>
          </div>
        </div>
        <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm ${isListLocked ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          {isListLocked ? 'Verified' : 'Pending'}
        </span>
      </div>
    </div>
  );

  if (currentStage === 4) {
    return (
      <div className="bg-white rounded-sm border border-amber-200 shadow-sm p-8 sm:p-12 flex flex-col text-center bg-amber-50/30">
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 border border-amber-200 mx-auto">
          <Clock size={40} className="text-amber-600" />
        </div>
        <h3 className="text-xl font-extrabold text-amber-800 mb-3">Under Administrative Review</h3>
        <p className="text-[14px] text-amber-700/80 max-w-lg mx-auto leading-relaxed">
          Your payment and registered student lists have been submitted and are currently being reviewed by our administrative team. 
          This process typically takes <strong>24 to 48 hours</strong>.
        </p>
        
        {renderChecklist()}

        <div className="mt-8 mx-auto flex items-center justify-center gap-2 text-[13px] font-bold text-amber-600 bg-amber-100 px-4 py-2 rounded-sm w-max">
          <AlertCircle size={16} />
          Please note: You cannot edit your student lists during this time.
        </div>
      </div>
    );
  }

  // currentStage === 5
  return (
    <div className="bg-white rounded-sm border border-emerald-200 shadow-sm p-8 sm:p-12 flex flex-col text-center bg-emerald-50/30">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border border-emerald-200 mx-auto">
        <ShieldCheck size={40} className="text-emerald-600" />
      </div>
      <h3 className="text-xl font-extrabold text-emerald-800 mb-3">Submission Verified Successfully</h3>
      <p className="text-[14px] text-emerald-700/80 max-w-lg mx-auto leading-relaxed">
        Your payment and registration lists have been fully verified. Your lists are now locked, and you have been granted access to generate and download admit cards.
      </p>

      {renderChecklist()}
    </div>
  );
}
