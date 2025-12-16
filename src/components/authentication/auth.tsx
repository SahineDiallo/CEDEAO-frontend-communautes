'use client'

import { useState } from 'react'
import {Link} from 'react-router-dom'
import { Eye, EyeOff, User, Lock } from 'lucide-react'
import { AuthLayout } from '../AuthLayout'


interface AuthFormProps {
  type: 'login' | 'register' | 'reset-password' | 'change-password'
}

export default function AuthForm({ type }: AuthFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    newPassword: '',
    confirmPassword: '',
    rememberMe: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const renderFormFields = () => {
    switch (type) {
      case 'login':
        return (
          <>
            <InputWithIcon
              icon={<User className="h-5 w-5 text-gray-400" />}
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nom d'utilisateur"
              required
            />
            <InputWithIcon
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 border-gray-300 text-primary focus:ring-[#128C4F]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Rester connecté
                </label>
              </div>
              <Link to="/forgot-password" className="text-sm font-medium text-primary hover:text-primary/80">
                Mot de passe oublié ?
              </Link>
            </div>
          </>
        )
      case 'register':
        return (
          <>
            <InputWithIcon
              icon={<User className="h-5 w-5 text-gray-400" />}
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nom d'utilisateur"
              required
            />
            <InputWithIcon
              icon={<User className="h-5 w-5 text-gray-400" />}
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <InputWithIcon
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </>
        )
      case 'reset-password':
        return (
          <InputWithIcon
            icon={<User className="h-5 w-5 text-gray-400" />}
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
        )
      case 'change-password':
        return (
          <>
            <InputWithIcon
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              id="newPassword"
              name="newPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Nouveau mot de passe"
              required
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
            <InputWithIcon
              icon={<Lock className="h-5 w-5 text-gray-400" />}
              id="confirmPassword"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirmer le mot de passe"
              required
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </>
        )
    }
  }

  const getTitle = () => {
    switch (type) {
      case 'login':
        return 'Connexion'
      case 'register':
        return 'Inscription'
      case 'reset-password':
        return 'Réinitialiser le mot de passe'
      case 'change-password':
        return 'Changer le mot de passe'
    }
  }

  const getButtonText = () => {
    switch (type) {
      case 'login':
        return 'Se connecter'
      case 'register':
        return 'S\'inscrire'
      case 'reset-password':
        return 'Envoyer le lien de réinitialisation'
      case 'change-password':
        return 'Changer le mot de passe'
    }
  }

  return (
    <AuthLayout
      imageSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-11%20at%2016.40.59-LeWy743UdmkZ3dvYuVLoWiO3Kpjh8b.png"
      imageAlt="Person working on laptop"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {type === 'login' ? 'Connectez-vous pour continuer' : ''}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {renderFormFields()}
        <button
          type="submit"
          className="w-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-[#128C4F] focus:ring-offset-2"
        >
          {getButtonText()}
        </button>
      </form>

      {type === 'login' && (
        <p className="mt-4 text-center text-sm text-gray-600">
          Vous n'avez pas de compte ?{' '}
          <Link to="/signup" className="font-medium text-primary hover:text-primary/80">
            S'inscrire maintenant
          </Link>
        </p>
      )}

      <p className="mt-8 text-center text-xs text-gray-500">
        © 2024 MJ Business!
      </p>
    </AuthLayout>
  )
}

interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode
  showPassword?: boolean
  togglePassword?: () => void
}

function InputWithIcon({ icon, showPassword, togglePassword, ...props }: InputWithIconProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        {icon}
      </div>
      <input
        {...props}
        className="block w-full border border-gray-300 pl-10 pr-3 py-2 text-gray-900 placeholder-gray-500 focus:border-[#128C4F] focus:outline-none focus:ring-1 focus:ring-[#128C4F] sm:text-sm"
      />
      {togglePassword && (
        <button
          type="button"
          onClick={togglePassword}
          className="absolute inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" />
          )}
        </button>
      )}
    </div>
  )
}

