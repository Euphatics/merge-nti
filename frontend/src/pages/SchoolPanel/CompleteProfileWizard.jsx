import {
  Check,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { FloatingLabel } from '../../components/ui/FloatingInput';
import useCompleteProfileForm from '../../hooks/useCompleteProfileForm';

export default function CompleteProfileWizard({ schoolId, onComplete }) {
  const {
    currentStep,
    totalSteps,
    formData,
    errors,
    touched,
    submitted,
    isSubmitting,
    handleChange,
    handleBlur,
    handleNext,
    handlePrev,
    handleSubmit
  } = useCompleteProfileForm({ schoolId, onComplete });

  const getSelectClass = (fieldName) => {
    const baseClass = "w-full pl-3 pr-3 py-1.5 text-[14px] border rounded-md outline-none transition-all text-gray-800 bg-white cursor-pointer relative z-10 font-medium";
    if ((touched[fieldName] || submitted) && errors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-0 focus:border-red-500`;
    }
    return `${baseClass} border-gray-300 focus:ring-0 focus:border-blue-600`;
  };

  const renderError = (fieldName) => {
    if ((touched[fieldName] || submitted) && errors[fieldName]) {
      return (
        <p className="text-[12px] text-red-600 mt-1.5 font-medium">
          {errors[fieldName]}
        </p>
      );
    }
    return null;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="section-header">
        <h3>1. School Details</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="School Name" name="schoolName" value={formData.schoolName} onChange={handleChange} onBlur={handleBlur} color={(touched.schoolName || submitted) && errors.schoolName ? "error" : "default"} />
          {renderError('schoolName')}
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Official Email" name="email" type="email" value={formData.email} onChange={handleChange} onBlur={handleBlur} color={(touched.email || submitted) && errors.email ? "error" : "default"} />
          {renderError('email')}
        </div>
      </div>
      <div className="input-wrapper">
        <FloatingLabel variant="outlined" label="School Address" name="schoolAddress" value={formData.schoolAddress} onChange={handleChange} onBlur={handleBlur} color={(touched.schoolAddress || submitted) && errors.schoolAddress ? "error" : "default"} />
        {renderError('schoolAddress')}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="City" name="city" value={formData.city} onChange={handleChange} onBlur={handleBlur} color={(touched.city || submitted) && errors.city ? "error" : "default"} />
          {renderError('city')}
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="State" name="state" value={formData.state} onChange={handleChange} onBlur={handleBlur} color={(touched.state || submitted) && errors.state ? "error" : "default"} />
          {renderError('state')}
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Pin Code" name="pinCode" value={formData.pinCode} onChange={handleChange} onBlur={handleBlur} color={(touched.pinCode || submitted) && errors.pinCode ? "error" : "default"} />
          {renderError('pinCode')}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="input-wrapper">
          <label className="block text-[13px] text-gray-500 mb-1">Country</label>
          <select name="country" value={formData.country} onChange={handleChange} onBlur={handleBlur} className={getSelectClass('country')}>
            <option value="in">India</option>
            <option value="us">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="au">Australia</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="input-wrapper">
          <label className="block text-[13px] text-gray-500 mb-1">School Type</label>
          <select name="schoolType" value={formData.schoolType} onChange={handleChange} className={getSelectClass('schoolType')}>
            <option value="">Select Type</option>
            <option value="Government">Government</option>
            <option value="Private">Private</option>
            <option value="Semi-Government">Semi-Government</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Phone No. (Landline)" name="phoneLandline" value={formData.phoneLandline} onChange={handleChange} />
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Mobile No." name="phoneMobile" type="tel" value={formData.phoneMobile} onChange={handleChange} onBlur={handleBlur} color={(touched.phoneMobile || submitted) && errors.phoneMobile ? "error" : "default"} />
          {renderError('phoneMobile')}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Affiliation / Board" name="affiliationBoard" value={formData.affiliationBoard} onChange={handleChange} />
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Affiliation No." name="affiliationNo" value={formData.affiliationNo} onChange={handleChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="School Website" name="website" value={formData.website} onChange={handleChange} />
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Year of Establishment" name="yearOfEstablishment" type="number" value={formData.yearOfEstablishment} onChange={handleChange} />
        </div>
        <div className="input-wrapper">
          <FloatingLabel variant="outlined" label="Total Strength" name="totalStrength" type="number" value={formData.totalStrength} onChange={handleChange} />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="form-section">
        <div className="section-header">
          <h3>2. Principal / Head of Institution</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Name" name="principalName" value={formData.principalName} onChange={handleChange} onBlur={handleBlur} color={(touched.principalName || submitted) && errors.principalName ? "error" : "default"} />
            {renderError('principalName')}
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Designation" name="principalDesignation" value={formData.principalDesignation} disabled />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Email ID" name="principalEmail" type="email" value={formData.principalEmail} onChange={handleChange} />
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Mobile No." name="principalMobile" type="tel" value={formData.principalMobile} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>3. Coordinator Details (Olympiad In-Charge)</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Name" name="coordinatorName" value={formData.coordinatorName} onChange={handleChange} onBlur={handleBlur} color={(touched.coordinatorName || submitted) && errors.coordinatorName ? "error" : "default"} />
            {renderError('coordinatorName')}
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Designation" name="coordinatorDesignation" value={formData.coordinatorDesignation} onChange={handleChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Email ID" name="coordinatorEmail" type="email" value={formData.coordinatorEmail} onChange={handleChange} />
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Mobile No." name="coordinatorMobile" type="tel" value={formData.coordinatorMobile} onChange={handleChange} onBlur={handleBlur} color={(touched.coordinatorMobile || submitted) && errors.coordinatorMobile ? "error" : "default"} />
            {renderError('coordinatorMobile')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="form-section">
        <div className="section-header">
          <h3>4. Participation Details</h3>
        </div>
        
        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-gray-700 mb-3">We wish to participate in the following subjects:</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {['Mathematics Olympiad', 'Science Olympiad', 'English Olympiad', 'Information Technology Olympiad', 'Finance Olympiad'].map(subject => (
              <label key={subject} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="subjects" value={subject} checked={formData.subjects.includes(subject)} onChange={handleChange} className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-[14px] text-gray-700">{subject}</span>
              </label>
            ))}
          </div>
          {renderError('subjects')}
        </div>

        <div className="mb-6">
          <label className="block text-[14px] font-semibold text-gray-700 mb-3">Classes to be enrolled (Tick all applicable):</label>
          <div className="flex flex-wrap gap-6">
            {['1-4', '5-7', '8-10', '11-12'].map(cls => (
              <label key={cls} className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" name="classes" value={cls} checked={formData.classes.includes(cls)} onChange={handleChange} className="rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-[14px] text-gray-700">{cls}</span>
              </label>
            ))}
          </div>
          {renderError('classes')}
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3>5. Total Participation (Approximate)</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Classes 1 - 4" name="count1to4" type="number" value={formData.count1to4} onChange={handleChange} />
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Classes 5 - 7" name="count5to7" type="number" value={formData.count5to7} onChange={handleChange} />
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Classes 8 - 10" name="count8to10" type="number" value={formData.count8to10} onChange={handleChange} />
          </div>
          <div className="input-wrapper">
            <FloatingLabel variant="outlined" label="Classes 11 - 12" name="count11to12" type="number" value={formData.count11to12} onChange={handleChange} />
          </div>
        </div>
        <div className="input-wrapper sm:w-1/2">
          <FloatingLabel variant="outlined" label="Total Participation (All Classes)" name="totalCount" type="number" value={formData.totalCount} onChange={handleChange} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-500">Please provide the remaining details to access your dashboard.</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-in-out"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            />
          </div>
          {[1, 2, 3].map((step) => (
            <div key={step} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 shadow-sm
                  ${currentStep === step ? 'bg-blue-600 text-white ring-4 ring-blue-100' :
                    currentStep > step ? 'bg-blue-600 text-white' :
                      'bg-white text-gray-400 border-2 border-gray-200'}`}
              >
                {currentStep > step ? <Check className="w-5 h-5" /> : step}
              </div>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="min-h-[400px]">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all
              ${currentStep === 1
                ? 'opacity-0 invisible'
                : 'text-gray-600 bg-gray-50 hover:bg-gray-100'
              }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          
          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-8 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Complete Profile
                  <Check className="w-5 h-5" />
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <style dangerouslySetInnerHTML={{__html: `
        .input-wrapper input, .input-wrapper select, .input-wrapper textarea { border-radius: 6px !important; border-color: #cbd5e1 !important; }
        .input-wrapper input:focus, .input-wrapper select:focus, .input-wrapper textarea:focus { border-color: #3b82f6 !important; box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15) !important; }
        .section-header h3 { font-size: 15px; font-weight: 700; color: #1e293b; text-transform: uppercase; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 1px solid #e2e8f0; }
      `}} />
    </div>
  );
}
