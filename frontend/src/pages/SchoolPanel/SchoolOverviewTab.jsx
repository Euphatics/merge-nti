import {
  School,
  MapPin,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Users,
  IndianRupee,
  Clock,
  Lock,
} from 'lucide-react';

/** Visual treatment for each payment state. */
const PAYMENT_STATES = {
  none: {
    label: 'Not submitted',
    icon: AlertCircle,
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    hint: 'Upload your student lists, then submit the payment proof to confirm your registration.',
  },
  pending: {
    label: 'Under review',
    icon: Clock,
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    hint: 'Your payment proof is with the NTI team. Your student lists are locked while it is reviewed.',
  },
  verified: {
    label: 'Verified',
    icon: CheckCircle2,
    className: 'bg-green-50 text-green-700 border-green-200',
    hint: 'Payment confirmed. Your registration is complete and admit cards will follow.',
  },
  rejected: {
    label: 'Rejected',
    icon: AlertCircle,
    className: 'bg-red-50 text-red-700 border-red-200',
    hint: 'Your payment proof was not accepted. Please review the notes and submit again.',
  },
};

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="text-[#9CA3AF] mt-0.5 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">{label}</p>
        <p className="text-[#1F2937] font-medium mt-0.5 leading-snug break-words">{value || '—'}</p>
      </div>
    </div>
  );
}

function StatTile({ icon: Icon, label, value, tone = 'default' }) {
  const tones = {
    default: 'text-[#1F2937]',
    accent: 'text-[#1D4ED8]',
  };
  return (
    <div className="rounded-sm border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1.5">
        <Icon size={13} strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <p className={`text-2xl font-extrabold tabular-nums ${tones[tone]}`}>{value}</p>
    </div>
  );
}

export default function SchoolOverviewTab({
  schoolProfile,
  isLoading,
  totalStudents,
  totalFee,
  isListLocked,
  paymentStatus,
  setPaymentModalOpen,
}) {
  const state = PAYMENT_STATES[paymentStatus] ?? PAYMENT_STATES.none;
  const StatusIcon = state.icon;

  // Payment can only be submitted once there is something to pay for and no
  // submission is already in flight.
  const canSubmitPayment = totalStudents > 0 && (paymentStatus === 'none' || paymentStatus === 'rejected');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* School Profile Card */}
        <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 bg-[#F9FAFB]">
            <School size={16} className="text-[#1D4ED8]" />
            <h2 className="text-[13px] font-bold text-[#1F2937] uppercase tracking-wider">School Details</h2>
          </div>
          <div className="p-5 space-y-5 text-[14px]">
            {isLoading ? (
              <div className="space-y-4" aria-hidden="true">
                <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <DetailRow icon={MapPin} label="Address" value={schoolProfile?.schoolAddress} />
                <DetailRow icon={User} label="Incharge Teacher" value={schoolProfile?.inchargeTeacher} />
                <DetailRow icon={Phone} label="Contact" value={schoolProfile?.inchargeContact} />
                <DetailRow icon={School} label="School Code" value={schoolProfile?.schoolCode} />
              </>
            )}
          </div>
        </div>

        {/* Registration summary — previously this half of the grid was empty and
            the counts passed in from the panel were discarded. */}
        <div className="bg-white rounded-sm border border-[#E5E7EB] shadow-sm flex flex-col">
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2 bg-[#F9FAFB]">
            <Users size={16} className="text-[#1D4ED8]" />
            <h2 className="text-[13px] font-bold text-[#1F2937] uppercase tracking-wider">
              Registration Summary
            </h2>
          </div>

          <div className="p-5 flex-1 flex flex-col">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-3" aria-hidden="true">
                <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
                <div className="h-20 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <StatTile icon={Users} label="Students" value={totalStudents} />
                  <StatTile
                    icon={IndianRupee}
                    label="Total Fee"
                    value={`₹${totalFee.toLocaleString('en-IN')}`}
                    tone="accent"
                  />
                </div>

                <div className={`mt-4 rounded-sm border px-4 py-3 ${state.className}`}>
                  <div className="flex items-center gap-2">
                    <StatusIcon size={15} strokeWidth={2.5} />
                    <span className="text-[12px] font-bold uppercase tracking-wider">
                      Payment · {state.label}
                    </span>
                  </div>
                  <p className="text-[13px] mt-1.5 leading-relaxed opacity-90">{state.hint}</p>
                </div>

                {isListLocked && (
                  <p className="mt-3 flex items-center gap-1.5 text-[12px] text-gray-500">
                    <Lock size={12} strokeWidth={2.5} />
                    Your student list is locked and can no longer be edited.
                  </p>
                )}

                <div className="mt-auto pt-5">
                  {canSubmitPayment ? (
                    <button
                      type="button"
                      onClick={() => setPaymentModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-sm bg-[#1D4ED8] text-white text-[13px] font-bold hover:bg-blue-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 transition-colors"
                    >
                      Submit Payment Proof
                      <ArrowRight size={15} strokeWidth={2.5} />
                    </button>
                  ) : (
                    totalStudents === 0 && (
                      <p className="text-[13px] text-gray-500 text-center">
                        Upload at least one subject list to continue.
                      </p>
                    )
                  )}
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
