import { School, MapPin, User, Phone, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

export default function SchoolOverviewTab({ 
  schoolProfile, 
  isLoading, 
  totalStudents, 
  totalFee, 
  isListLocked, 
  paymentStatus, 
  setPaymentModalOpen 
}) {
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
               <div className="space-y-4">
                 <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                 <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
                 <div className="h-8 bg-gray-100 rounded animate-pulse"></div>
               </div>
            ) : (
              <>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#9CA3AF] mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Address</p>
                    <p className="text-[#1F2937] font-medium mt-0.5 leading-snug">{schoolProfile?.schoolAddress || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={16} className="text-[#9CA3AF] mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Incharge Teacher</p>
                    <p className="text-[#1F2937] font-medium mt-0.5">{schoolProfile?.inchargeTeacher || '—'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-[#9CA3AF] mt-0.5" />
                  <div>
                    <p className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">Contact</p>
                    <p className="text-[#1F2937] font-medium mt-0.5">{schoolProfile?.inchargeContact || '—'}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
