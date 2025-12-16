import { Twitter, Facebook, Youtube } from "lucide-react"
import logo_white from "/logo_white.png"
import { Input } from "./ui/input"
import { Button } from "./ui/Button"
import { Link } from "react-router-dom"
import { Textarea } from "./ui/textareaFooter"

export default function Footer() {
  return (
    <footer className="text-white py-16 relative" 
      style={{
        backgroundImage: "url('/bg_footer.png')", // Add url() here
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
            {/* Left Column */}
            <div>
              <img
                src={logo_white}
                alt="IEG-CEDEAO Logo"
                height={80}
                className="mb-6 object-contain"
              />
              <p className="text-gray-300 mb-8 max-w-lg font-medium">
                Plateforme de calcul de L&apos;indice d&apos;Égalité de Genre (IEG) des pays de la CEDEAO
              </p>
              <p className="text-gray-400 mb-8 max-w-lg text-sm font-medium">
                L&apos;indice d&apos;Égalité de Genre (IEG) des pays de la CEDEAO est un indicateur multidimensionnel qui
                évalue les disparités entre les sexes dans 15 pays membres, couvrant les domaines de l&apos;éducation, de
                l&apos;emploi,
              </p>
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Nous suivre sur nos réseaux</h3>
                <div className="flex gap-4">
                  <Link to="#" className="hover:text-[#DCC820] transition-colors">
                    <Twitter className="w-6 h-6" />
                  </Link>
                  <Link to="#" className="hover:text-[#DCC820] transition-colors">
                    <Facebook className="w-6 h-6" />
                  </Link>
                  <Link to="#" className="hover:text-[#DCC820] transition-colors">
                    <Youtube className="w-6 h-6" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div>
              <h3 className="text-2xl font-bold mb-6">RESTER EN CONTACT</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    type="text"
                    placeholder="Nom et prénom"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
                  />
                  <Input
                    type="email"
                    placeholder="Adresse email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 h-12"
                  />
                </div>
                <Textarea
                  placeholder="Message"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
                />
                <Button type="submit" className="bg-[#128C4F] hover:bg-[#0F7A43] text-white px-8">
                  Contactez-nous
                </Button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-400">
            © 2025 CEDEAO. All Rights Reserved
          </div>
        </div>
    </footer>
  )
}

