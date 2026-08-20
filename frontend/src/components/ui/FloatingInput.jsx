export function FloatingInput({ label, name, type = 'text', value, onChange, onBlur, color, disabled }) {
  const isError = color === 'error';
  return (
    <div className="relative z-0 w-full mb-2 group">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 appearance-none focus:outline-none focus:ring-0 peer ${
          isError ? 'border-red-500 focus:border-red-600' : 'border-gray-300 focus:border-blue-600'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        placeholder=" "
      />
      <label
        htmlFor={name}
        className={`peer-focus:font-medium absolute text-sm duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 ${
          isError ? 'text-red-500 peer-focus:text-red-600' : 'text-gray-500 peer-focus:text-blue-600'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

// Since CompleteProfileWizard imported it as FloatingLabel previously, let's also export it as FloatingLabel for compatibility just in case
export const FloatingLabel = FloatingInput;
