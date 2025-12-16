import { useState, useMemo } from 'react';
import { User, Lock, Mail, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { InputWithIcon } from '../ui/InputWithIcon';
import StepIndicator from '../ui/stepIndicator';
import TextArea from '../ui/Textarea';
import Logo from '../../assets/logo_black.png';

type Step = 'basic' | 'security' | 'other';

interface CountryOption {
  label: string;
  value: string;
  error?: string;
}

export default function SignupPage() {
  const [step, setStep] = useState<Step>('basic');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const domain = import.meta.env.VITE_MAIN_DOMAIN;
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    country: null as CountryOption | null,
    password: '',
    re_password: '',
    email: '',
    bio: '',
    organisation: '',
    general: '',
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const countries = useMemo(() => countryList().getData(), []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleCountryChange = (option: CountryOption | null) => {
    setFormData((prev) => ({ ...prev, country: option }));
    setErrors((prev) => ({ ...prev, country: { label: '', value: '' } }));
  };

  const handleBioChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    setFormData((prev) => ({ ...prev, bio: content }));
    setErrors((prev) => ({ ...prev, bio: '' }));
  };

  const validateStep = (currentStep: Step): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (currentStep === 'basic') {
      if (!formData.username) newErrors.username = "Le nom d'utilisateur est requis";
      if (!formData.first_name) newErrors.first_name = 'Le prénom est requis';
      if (!formData.last_name) newErrors.last_name = 'Le nom de famille est requis';
      if (!formData.country)
        newErrors.country = { label: '', value: '', error: 'Le pays est requis' };
    } else if (currentStep === 'security') {
      if (!formData.password) newErrors.password = 'Le mot de passe est requis';
      if (formData.password !== formData.re_password)
        newErrors.re_password = 'Les mots de passe ne correspondent pas';
      if (!formData.email) newErrors.email = "L'email est requis";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    } else if (currentStep === 'other') {
      if (!formData.bio) newErrors.bio = 'La biographie est requise';
      if (!formData.organisation) newErrors.organisation = "L'organisation est requise";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    const newFormData = {
      ...formData,
      country: formData?.country?.value,
      biographie: formData.bio,
    };

    try {
      const response = await fetch(`${domain}/comptes/signup/step/${step}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFormData),
      });

      const data = await response.json();
      if (response.ok) {
        if (step === 'basic') setStep('security');
        else if (step === 'security') setStep('other');
      } else {
        setErrors(data);
      }
    } catch (error) {
      console.error('Error during backend validation:', error);
      setErrors({ general: 'Une erreur est survenue, veuillez réessayer plus tard.' });
    }
  };

  const handlePrevious = () => {
    if (step === 'security') setStep('basic');
    else if (step === 'other') setStep('security');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep('other')) {
      setLoading(true);
      try {
        const newFormData = {
          ...formData,
          country: formData?.country?.value,
          biographie: formData.bio,
        };

        const response = await fetch(`${domain}/comptes/signup/step/other/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFormData),
        });

        if (response.ok) {
          setIsSuccess(true);
        } else {
          const text = await response.text();
          try {
            const data = JSON.parse(text);
            setErrors(data);
          } catch {
            setErrors({ general: `Unexpected error: ${text}` });
          }
        }
      } catch (error) {
        console.error('Error during form submission:', error);
        setErrors({ general: 'Une erreur est survenue, veuillez réessayer plus tard.' });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img
              src={Logo}
              alt="Logo"
              className="h-16 mx-auto mb-4"
            />
          </Link>
          {/* <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
          <p className="text-gray-600 mt-2">
            Rejoignez notre communauté en quelques étapes
          </p> */}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
          {isSuccess ? (
            // Success Message
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-primary mb-3">
                Inscription réussie !
              </h2>
              <p className="text-gray-700 mb-6">
                Un email a été envoyé à <strong className="font-semibold">{formData.email}</strong>.
                Veuillez vérifier votre boîte de réception pour activer votre compte.
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors duration-200"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            // Registration Form
            <>
              <StepIndicator step={step} />

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {step === 'basic' && (
                  <>
                    <InputWithIcon
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      id="username"
                      name="username"
                      label="Nom d'utilisateur"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      error={errors.username}
                    />
                    <InputWithIcon
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      id="first_name"
                      label="Prénom"
                      name="first_name"
                      type="text"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      error={errors.first_name}
                    />
                    <InputWithIcon
                      icon={<User className="h-5 w-5 text-gray-400" />}
                      id="last_name"
                      label="Nom de famille"
                      name="last_name"
                      type="text"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      error={errors.last_name}
                    />
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Pays
                      </label>
                      <Select
                        id="country"
                        name="country"
                        options={countries}
                        value={formData.country}
                        onChange={handleCountryChange}
                        placeholder="Sélectionnez votre pays"
                        className={`${errors.country?.error ? 'border-red-500' : 'border-gray-300'}`}
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderRadius: '0.375rem',
                            borderColor: errors.country?.error ? '#ef4444' : '#d1d5db',
                            padding: '8px 12px',
                            '&:hover': {
                              borderColor: errors.country?.error ? '#ef4444' : '#9ca3af',
                            },
                          }),
                        }}
                      />
                      {errors.country?.error && (
                        <p className="mt-2 text-sm text-red-600">{errors.country?.error}</p>
                      )}
                    </div>
                  </>
                )}

                {step === 'security' && (
                  <>
                    <InputWithIcon
                      icon={<Lock className="h-5 w-5 text-gray-400" />}
                      id="password"
                      label="Mot de passe"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      showPassword={showPassword}
                      togglePassword={() => setShowPassword(!showPassword)}
                      error={errors.password}
                    />
                    <InputWithIcon
                      icon={<Lock className="h-5 w-5 text-gray-400" />}
                      id="re_password"
                      name="re_password"
                      label="Confirmer mot de passe"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.re_password}
                      onChange={handleChange}
                      required
                      showPassword={showPassword}
                      togglePassword={() => setShowPassword(!showPassword)}
                      error={errors.re_password}
                    />
                    <InputWithIcon
                      icon={<Mail className="h-5 w-5 text-gray-400" />}
                      id="email"
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      error={errors.email}
                    />
                  </>
                )}

                {step === 'other' && (
                  <>
                    <div>
                      <TextArea
                        id="bio"
                        label="Biographie"
                        value={formData.bio}
                        onChange={handleBioChange}
                        placeholder="Décrivez votre parcours, vos intérêts..."
                        error={errors.bio}
                      />
                      {errors.bio && <p className="mt-2 text-sm text-red-600">{errors.bio}</p>}
                    </div>
                    <InputWithIcon
                      icon={<Building className="h-5 w-5 text-gray-400" />}
                      id="organisation"
                      label="Organisation"
                      name="organisation"
                      type="text"
                      value={formData.organisation}
                      onChange={handleChange}
                      required
                      error={errors.organisation}
                    />
                  </>
                )}

                {errors.general && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center">{errors.general}</p>
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  {step !== 'basic' && (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="px-5 py-3 text-sm font-medium text-primary bg-white border border-primary rounded-lg hover:bg-primary/5 transition-colors duration-200"
                    >
                      Précédent
                    </button>
                  )}
                  {step !== 'other' ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className={`px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200 ${step === 'basic' ? 'ml-auto' : ''}`}
                    >
                      Suivant
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className={`px-5 py-3 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors duration-200 ${step === 'basic' ? 'ml-auto' : ''} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Inscription...
                        </span>
                      ) : (
                        "S'inscrire"
                      )}
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors duration-200">
                    Se connecter
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Communautés CEDEAO. Tous droits réservés.
        </p>
      </div>
    </div>
  );
}