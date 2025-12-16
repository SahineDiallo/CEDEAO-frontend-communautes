import { Link } from "react-router-dom"
// import { Card } from "./ui/card"

interface NewsCardProps {
  pkId: string
  title: string
  description: string
  imageUrl: string
}

export const NewsCard = ({ pkId, title, description, imageUrl }: NewsCardProps) => {
  return (
    <Link to={`/communaute-details/${pkId}/a-propos`} className="group block">
      <div className="bg-white p-4 shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
        <div className="aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={imageUrl || "/placeholder.svg?height=400&width=600"}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="py-4 space-y-4">
          <div className="text-sm font-medium text-primary uppercase tracking-wide">Communauté</div>

          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors flex items-start justify-between gap-2">
            <span className="line-clamp-2">{title}</span>
            <svg
              className="w-5 h-5 flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-3">{description}</p>

          <div className="flex items-center gap-3 pt-4 border-t border-border">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
              <img
                src={imageUrl || "/placeholder.svg?height=40&width=40"}
                alt="Admin"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="text-sm font-medium text-foreground">Administrateur</div>
              <div className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
