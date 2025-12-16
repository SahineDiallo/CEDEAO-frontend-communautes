

const UploadProgress = ({ value = 0, className = '', ...props }) => {
  return (
    <div className={`w-full bg-gray-200 rounded-full ${className}`} {...props}>
      <div 
        className="bg-blue-600 h-full rounded-full transition-all duration-300" 
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default UploadProgress;