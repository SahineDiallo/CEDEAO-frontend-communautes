import { cn } from "../../lib/utils"


interface HeroSectionProps {
  className?: string
  title: string
}

export function HeroSection({ className, title }: HeroSectionProps) {
  return (
    <div 
      className={cn(
        "relative h-[200px] md:h-[300px] w-full bg-[#1a3c34] flex items-center justify-center",
        className
      )}
    >
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: "url('/placeholder.svg?height=300&width=1200')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      />
      <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold text-white">
        {title}
      </h1>
    </div>
  )
}

