'use client'

import { useState } from 'react'
import {Link} from 'react-router-dom'
import { Lock } from 'lucide-react'
import { AuthLayout } from '../AuthLayout'
import { InputWithIcon } from '../ui/InputWithIcon'


export default function ChangePasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    newPassword: '',
    reNewPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <AuthLayout
      imageSrc="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-11%20at%2016.40.59-LeWy743UdmkZ3dvYuVLoWiO3Kpjh8b.png"
      imageAlt="Person working on laptop"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Changer le mot de passe</h1>
        <p className="mt-2 text-sm text-gray-600">
          Entrez votre nouveau mot de passe
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <InputWithIcon
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          id="newPassword"
          name="newPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.newPassword}
          onChange={handleChange}
          label="Nouveau mot de passe"
          required
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
        />
        <InputWithIcon
          icon={<Lock className="h-5 w-5 text-gray-400" />}
          id="reNewPassword"
          name="reNewPassword"
          type={showPassword ? 'text' : 'password'}
          value={formData.reNewPassword}
          onChange={handleChange}
          label="Confirmer le nouveau mot de passe"
          required
          showPassword={showPassword}
          togglePassword={() => setShowPassword(!showPassword)}
        />
        <button
          type="submit"
          className="w-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-[#128C4F] focus:ring-offset-2"
        >
          Changer le mot de passe
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Vous avez changé d'avis ?{' '}
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

