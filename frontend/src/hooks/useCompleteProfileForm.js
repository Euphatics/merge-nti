import { useState } from 'react';
import toast from 'react-hot-toast';
import { API_BASE_URL, fetchOptions } from '../config/api';

export default function useCompleteProfileForm({ schoolId, onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [formData, setFormData] = useState({
    // Step 1
    schoolName: '',
    schoolAddress: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'in', // default
    phoneLandline: '',
    phoneMobile: '',
    email: '',
    website: '',
    affiliationBoard: '',
    affiliationNo: '',
    schoolType: '',
    yearOfEstablishment: '',
    totalStrength: '',

    // Step 2
    principalName: '',
    principalDesignation: 'Principal',
    principalEmail: '',
    principalMobile: '',
    coordinatorName: '',
    coordinatorDesignation: 'Coordinator',
    coordinatorEmail: '',
    coordinatorMobile: '',

    // Step 3
    subjects: [],
    classes: [],
    count1to4: '',
    count5to7: '',
    count8to10: '',
    count11to12: '',
    totalCount: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step, data) => {
    let newErrors = {};

    if (step === 1) {
      if (!String(data.schoolName || '').trim()) newErrors.schoolName = 'Required';
      if (!String(data.schoolAddress || '').trim()) newErrors.schoolAddress = 'Required';
      if (!String(data.city || '').trim()) newErrors.city = 'Required';
      if (!String(data.state || '').trim()) newErrors.state = 'Required';
      if (!String(data.pinCode || '').trim()) newErrors.pinCode = 'Required';
      if (!String(data.email || '').trim()) newErrors.email = 'Required';
      if (!String(data.phoneMobile || '').trim()) newErrors.phoneMobile = 'Required';
    }

    if (step === 2) {
      if (!String(data.principalName || '').trim()) newErrors.principalName = 'Required';
      if (!String(data.coordinatorName || '').trim()) newErrors.coordinatorName = 'Required';
      if (!String(data.coordinatorMobile || '').trim()) newErrors.coordinatorMobile = 'Required';
    }

    if (step === 3) {
      if (!data.subjects || data.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
      if (!data.classes || data.classes.length === 0) newErrors.classes = 'Select at least one class group';
    }

    return newErrors;
  };

  const handleNext = () => {
    setSubmitted(true);
    const stepErrors = validateStep(currentStep, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setSubmitted(false);
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    setSubmitted(false);
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    let newData = { ...formData };

    if (type === 'checkbox') {
      // Handle array values for subjects and classes
      if (name === 'subjects' || name === 'classes') {
        const array = [...newData[name]];
        if (checked) {
          array.push(value);
        } else {
          const index = array.indexOf(value);
          if (index > -1) array.splice(index, 1);
        }
        newData[name] = array;
      } else {
        newData[name] = checked;
      }
    } else {
      newData[name] = value;
    }

    setFormData(newData);
    if (touched[name] || submitted) {
      // Re-validate only current step
      const stepErrors = validateStep(currentStep, newData);
      setErrors(prev => ({ ...prev, ...stepErrors }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const stepErrors = validateStep(currentStep, formData);
    setErrors(prev => ({ ...prev, ...stepErrors }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    // Final check for step 3
    const stepErrors = validateStep(3, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setIsSubmitting(true);
      
      // Prepare payload
      const payload = { ...formData };
      payload.subjects = payload.subjects.join(', ');
      payload.classes = payload.classes.join(', ');

      // Ensure counts are numbers (default to 0) to prevent backend validation errors
      payload.count1to4 = Number(payload.count1to4) || 0;
      payload.count5to7 = Number(payload.count5to7) || 0;
      payload.count8to10 = Number(payload.count8to10) || 0;
      payload.count11to12 = Number(payload.count11to12) || 0;
      payload.totalStrength = Number(payload.totalStrength) || 0;
      
      // Calculate totalCount automatically if the user left it empty
      if (!payload.totalCount) {
        payload.totalCount = payload.count1to4 + payload.count5to7 + payload.count8to10 + payload.count11to12;
      } else {
        payload.totalCount = Number(payload.totalCount) || 0;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/schools/${schoolId}/complete-profile`, fetchOptions('POST', payload));

        const data = await response.json();
        
        if (response.ok) {
          toast.success('Profile completed successfully!');
          onComplete && onComplete();
        } else {
          toast.error(`Error: ${data.error || data.message || 'Failed to complete profile'}`);
        }
      } catch (error) {
        console.error('Error completing profile:', error);
        toast.error('Network error. Is the backend server running?');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return {
    currentStep,
    totalSteps,
    formData,
    errors,
    touched,
    submitted,
    showPassword,
    isSubmitting,
    setShowPassword,
    handleChange,
    handleBlur,
    handleNext,
    handlePrev,
    handleSubmit
  };
}
