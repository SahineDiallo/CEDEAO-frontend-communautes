
import { ReactNode } from 'react'
import Logo from "../assets/logo_white.png"
import { Link } from 'react-router-dom'

interface AuthLayoutProps {
  children: ReactNode
  imageSrc: string
  imageAlt: string
}

export function AuthLayout({ children, imageSrc, imageAlt }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden w-1/2 bg-gray-100 md:block order-first">
        
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover"
          />
        
      </div>
      <div className="flex w-full flex-1 items-center justify-center bg-white px-6 py-12 md:w-1/2 md:px-12 order-last">
        <div className="w-full max-w-md space-y-8">
          <div className="flex justify-center">
            <div className="p-3 mb-6">
              <Link to="/">
                <img
                  src={Logo}
                  alt="Company Logo"
                  className="h-[50px] w-full object-contain"
                />
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

