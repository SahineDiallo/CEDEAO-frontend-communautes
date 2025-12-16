import { Users, User2, Handshake, FileText } from 'lucide-react'

interface Stat {
  icon: React.ReactNode
  label: string
  value: number
}

export function StatsSection() {
  const stats: Stat[] = [
    { icon: <Users className="h-8 w-8" />, label: "Communautés", value: 10 },
    { icon: <User2 className="h-8 w-8" />, label: "Membres", value: 33 },
    { icon: <Handshake className="h-8 w-8" />, label: "Partenaires", value: 9 },
    { icon: <FileText className="h-8 w-8" />, label: "Ressources", value: 25 },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto py-4 px-0 :py-6 lg:py-8 lg:px-0">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 text-center"
        >
          <div className="mb-2 text-primary">{stat.icon}</div>
          <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
          <div className="text-sm text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  )
}

