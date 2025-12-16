
import clsx from 'clsx';

const stepLabels = [
  { value: 'basic', label: 'Infos de base' },
  { value: 'security', label: 'Securité' },
  { value: 'other', label: 'Autres Infos' },
];

const StepIndicator = ({ step }: {step: string}) => {
  return (
    <div className="flex items-start justify-between my-10">
      {stepLabels.map((stepLabel, index) => (
        <div key={index} className="flex-1 text-center">
          {/* Step Circle */}
          <div
            className={clsx(
              'flex items-center justify-center w-10 h-10 mx-auto rounded-full text-white transition-all duration-300 ease-in-out',
              step === stepLabel.value ? 'bg-primary scale-110' : 'bg-gray-300 scale-100'
            )}
          >
            {index + 1}
          </div>

          {/* Step Label */}
          <p
            className={clsx(
              'mt-2 text-sm font-medium transition-all duration-300 ease-in-out',
              step === stepLabel.value ? 'text-primary font-semibold' : 'text-gray-600'
            )}
          >
            {stepLabel.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;