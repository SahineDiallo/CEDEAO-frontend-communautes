import { Button } from "@headlessui/react"
import { Stakeholder } from "../types"

interface StakeholderCardProps {
  stakeholder: Stakeholder
}

export function StakeholderCard({ stakeholder }: StakeholderCardProps) {
  return (
    <div className="flex gap-6 items-start p-4 border rounded-lg">
      <div className="w-24 h-24 relative flex-shrink-0">
        <img
          src={stakeholder.logo || "/placeholder.svg"}
          alt={`${stakeholder.name} logo`}
          className="object-contain"
        />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-medium">{stakeholder.name}</h3>
        <p className="text-muted-foreground">{stakeholder.type}</p>
        <Button className="text-primary p-0 h-auto justify-start">
          <a href={stakeholder.websiteUrl} target="_blank" rel="noopener noreferrer">
            Visiter le site web
          </a>
        </Button>
      </div>
    </div>
  )
}

