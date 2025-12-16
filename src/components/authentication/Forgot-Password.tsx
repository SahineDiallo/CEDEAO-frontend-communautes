'use client'

import { useState } from 'react'
import {Link} from 'react-router-dom'
import { Mail } from 'lucide-react'
import { AuthLayout } from '../AuthLayout'
import { InputWithIcon } from '../ui/InputWithIcon'
import authImage from '../../assets/auth_image.jpg';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <AuthLayout
      imageSrc={authImage}
      imageAlt="Person working on laptop"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre email pour réinitialiser votre mot de passe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <InputWithIcon
          icon={<Mail className="h-5 w-5 text-gray-400" />}
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          label='Email'
          required
        />
        <button
          type="submit"
          className="w-full bg-primary px-4 py-4 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-[#128C4F] focus:ring-offset-2"
        >
          Envoyer le lien de réinitialisation
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Vous vous souvenez de votre mot de passe ?{' '}
        <Link to="/login" className="font-medium text-primary hover:text-primary/80">
          Retour à la connexion
        </Link>
      </p>

      <p className="mt-8 text-center text-xs text-gray-500">
        © 2025 Communautés CEDEAO
      </p>
    </AuthLayout>
  )
}