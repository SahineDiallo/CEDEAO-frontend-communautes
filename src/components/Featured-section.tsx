import { Link } from "react-router-dom"

interface FeaturedSectionProps {
  featuredCommunity: {
    pkId: string
    title: string
    description: string
    imageUrl: string
  }
  activities: Array<{
    id: string
    user: {
      name: string
      avatar: string
    }
    action: string
    timestamp: string
  }>
}

export const FeaturedSection = ({ featuredCommunity }: FeaturedSectionProps) => {
  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div className="relative">
          <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
            <img
              src={featuredCommunity.imageUrl || "/placeholder.svg?height=600&width=800"}
              alt={featuredCommunity.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="px-3 py-1 bg-secondary/10 text-secondary text-sm font-medium">Actualités</span>
            <span className="px-3 py-1 bg-violet-50 text-violet-600 text-sm font-medium">Inspiration</span>
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-foreground leading-tight">{featuredCommunity.title}</h2>

          <div className="space-y-4">
            <p className="text-base text-muted-foreground leading-relaxed">
              Notre engagement à fournir de la valeur s'étend au-delà des fonctionnalités de nos produits ou services.
              Nous croyons en la promotion de partenariats à long terme en veillant à ce que nos plans de tarification
              soient justes.
            </p>
            <p className="text-base text-muted-foreground leading-relaxed">
              {featuredCommunity.description.slice(0, 200)}... Cette communauté rassemble des professionnels, chercheurs
              et défenseurs pour explorer les implications pratiques.
            </p>
          </div>

          <Link
            to={`/communaute-details/${featuredCommunity.pkId}/a-propos`}
            className="inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary transition-colors group"
          >
            <span className="border-b-2 border-foreground group-hover:border-primary">Acceder à la communauté</span>
            <svg
              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
