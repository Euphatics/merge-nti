import { CreditCard, AlertCircle, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

export default function SchoolPaymentTab({
  currentStage,
  isLoading,
  totalStudents,
  totalFee,
  paymentStatus,
  isListLocked,
  setPaymentModalOpen
}) {
  const isLocked = currentStage < 3;

  if (isLocked) {
    return (
      <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Lock size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937] mb-2">Payment Locked</h3>
        <p className="text-[14px] text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
          You must upload at least one student list in the <strong>Registrations</strong> tab before you can proceed to fee payment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm flex flex-col max-w-2xl mx-auto">
      <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 bg-[#F9FAFB]">
        <CreditCard size={16} className="text-[#1D4ED8]" />
        <h2 className="text-[13px] font-bold text-[#1F2937] uppercase tracking-wider">Fee Payment</h2>
      </div>
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="flex justify-between items-center pb-5 border-b border-gray-100">
            <p className="text-[14px] font-bold text-[#9CA3AF] uppercase tracking-wider">Total Registered Students</p>
            <p className="text-2xl font-extrabold text-[#1F2937]">{isLoading ? '-' : totalStudents}</p>
          </div>
          <div className="flex justify-between items-center pb-5 border-b border-gray-100">
            <p className="text-[14px] font-bold text-[#9CA3AF] uppercase tracking-wider">Total Fee Payable</p>
            <p className="text-3xl font-extrabold text-[#007BFF]">₹{isLoading ? '-' : totalFee.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="mt-8">
          {isListLocked ? (
            <div className="w-full px-6 py-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-sm text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <CheckCircle2 size={18} /> Payment Verified
            </div>
          ) : paymentStatus === 'pending' ? (
            <div className="w-full px-6 py-4 bg-amber-50 text-amber-700 border border-amber-200 rounded-sm text-[14px] font-bold uppercase tracking-wider flex items-center justify-center gap-2">
              <AlertCircle size={18} /> Payment Under Review
            </div>
          ) : (
            <button
              onClick={() => setPaymentModalOpen(true)}
              disabled={isLoading}
              className={`w-full px-6 py-4 rounded-sm font-bold transition-colors flex items-center justify-center gap-2 text-[14px] uppercase tracking-wider
                ${!isLoading
                  ? 'bg-[#007BFF] text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              Proceed to Payment
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
