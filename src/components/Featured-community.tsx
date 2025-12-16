import { Link } from "react-router-dom"
import { Card, CardContent } from "../components/ui/card"


interface FeaturedArticleProps {
  pkId: string;
  title: string
  description: string
  imageUrl: string
}

export function FeaturedArticle({ pkId, title, description, imageUrl }: FeaturedArticleProps) {
  return (
    <Card className="overflow-hidden rounded-none">
      <div className="relative aspect-[16/10] md:aspect-[16/9]">
      <Link to={`/communaute-details/${pkId}/a-propos`}>
        <img
          src={imageUrl}
          alt={title}
          className="object-cover"
        />
        </Link>
      </div>
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold mb-3">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
