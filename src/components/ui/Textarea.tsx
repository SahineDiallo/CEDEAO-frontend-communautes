interface TextAreaProps {
    id: string;
    label: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    cols?: number;
    error?: string;
  }
  
const TextArea: React.FC<TextAreaProps> = ({
    id,
    label,
    value,
    onChange,
    placeholder = '',
    rows = 10,
    cols = 50,
    error,
  }) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <textarea
          id={id}
          rows={rows}
          cols={cols}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full p-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          style={{ height: '300px' }}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  };

export default TextArea