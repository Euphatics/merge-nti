import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function useSchoolRegistrationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

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
    totalCount: '',

    // Step 4
    username: '',
    password: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step, data) => {
    let newErrors = {};

    if (step === 1) {
      if (!data.schoolName.trim()) newErrors.schoolName = 'Required';
      if (!data.schoolAddress.trim()) newErrors.schoolAddress = 'Required';
      if (!data.city.trim()) newErrors.city = 'Required';
      if (!data.state.trim()) newErrors.state = 'Required';
      if (!data.pinCode.trim()) newErrors.pinCode = 'Required';
      if (!data.email.trim()) newErrors.email = 'Required';
      if (!data.phoneMobile.trim()) newErrors.phoneMobile = 'Required';
      if (!data.affiliationBoard.trim()) newErrors.affiliationBoard = 'Required';
      if (!data.affiliationNo.trim()) newErrors.affiliationNo = 'Required';
      if (!data.schoolType.trim()) newErrors.schoolType = 'Required';
      if (!data.yearOfEstablishment.trim()) newErrors.yearOfEstablishment = 'Required';
      if (!data.totalStrength.trim()) newErrors.totalStrength = 'Required';
    }

    if (step === 2) {
      if (!data.principalName.trim()) newErrors.principalName = 'Required';
      if (!data.principalEmail.trim()) newErrors.principalEmail = 'Required';
      if (!data.principalMobile.trim()) newErrors.principalMobile = 'Required';
      if (!data.coordinatorName.trim()) newErrors.coordinatorName = 'Required';
      if (!data.coordinatorEmail.trim()) newErrors.coordinatorEmail = 'Required';
      if (!data.coordinatorMobile.trim()) newErrors.coordinatorMobile = 'Required';
    }

    if (step === 3) {
      if (data.subjects.length === 0) newErrors.subjects = 'Select at least one subject';
      if (data.classes.length === 0) newErrors.classes = 'Select at least one class group';
      if (!data.count1to4.trim()) newErrors.count1to4 = 'Required';
      if (!data.count5to7.trim()) newErrors.count5to7 = 'Required';
      if (!data.count8to10.trim()) newErrors.count8to10 = 'Required';
      if (!data.count11to12.trim()) newErrors.count11to12 = 'Required';
      if (!data.totalCount.trim()) newErrors.totalCount = 'Required';
    }

    if (step === 4) {
      if (!data.username.trim()) newErrors.username = 'Required';
      if (!data.password) newErrors.password = 'Required';
      else if (
        data.password.length < 8 ||
        !/[0-9]/.test(data.password) ||
        !/[^A-Za-z0-9]/.test(data.password)
      ) {
        newErrors.password = 'Password does not meet criteria';
      }
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
    
    // Final check for step 4
    const stepErrors = validateStep(4, formData);
    setErrors(stepErrors);
    
    if (Object.keys(stepErrors).length === 0) {
      setIsSubmitting(true);
      
      // Prepare payload
      const payload = { ...formData };
      payload.subjects = payload.subjects.join(', ');
      payload.classes = payload.classes.join(', ');

      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        
        if (response.ok) {
          toast.success('Registration successful! Please check your email for verification.');
          navigate('/login', { state: { message: 'Registered successfully! Please log in.' } });
        } else {
          toast.error(`Error: ${data.error || data.message || 'Registration failed'}`);
        }
      } catch (error) {
        console.error('Error during registration:', error);
        toast.error('Network error. Is the backend server running?');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const criteria = [
    { label: '8+ characters', met: formData.password.length >= 8 },
    { label: 'At least 1 number', met: /[0-9]/.test(formData.password) },
    { label: 'At least 1 special char (@, #, etc.)', met: /[^A-Za-z0-9]/.test(formData.password) }
  ];

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
    handleSubmit,
    criteria
  };
}
