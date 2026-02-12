import Hero from "@/components/sections/Hero"
import DemoShowcase from "@/components/sections/DemoShowcase"
import QuickFeatures from "@/components/sections/QuickFeatures"
import YamlPreview from "@/components/sections/YamlPreview"
import BottomCTA from "@/components/sections/BottomCTA"

export default function Home() {
  return (
    <main>
      <Hero />
      <DemoShowcase />
      <QuickFeatures />
      <YamlPreview />
      <BottomCTA />
    </main>
  )
}
