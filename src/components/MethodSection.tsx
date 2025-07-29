import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Activity, 
  Calendar, 
  UtensilsCrossed, 
  Leaf, 
  MessageCircle,
  CheckCircle 
} from "lucide-react"

const MethodSection = () => {
  const steps = [
    {
      icon: Activity,
      title: "Daily Yoga",
      description: "7-day specialized split targeting different body systems for complete wellness",
      color: "text-primary"
    },
    {
      icon: Calendar,
      title: "15-Day Consultations",
      description: "Personalized guidance sessions to monitor progress and adjust your healing plan",
      color: "text-secondary-accent"
    },
    {
      icon: UtensilsCrossed,
      title: "Custom Diet Charts",
      description: "Tailored nutrition plans using food as medicine for your specific condition",
      color: "text-accent-warm"
    },
    {
      icon: Leaf,
      title: "Seasonal Detox",
      description: "Natural cleansing protocols aligned with seasonal changes for optimal health",
      color: "text-primary-light"
    },
    {
      icon: MessageCircle,
      title: "24x7 WhatsApp Support",
      description: "Continuous support and guidance whenever you need it on your healing journey",
      color: "text-secondary-accent"
    }
  ]

  const results = [
    "PCOS completely reversed",
    "Hormonal balance restored",
    "Natural fertility enhancement",
    "Energy levels transformed",
    "Weight management achieved",
    "Emotional healing completed"
  ]

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            The <span className="text-primary">5-Step Holistic</span> Healing Method
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            A comprehensive approach that addresses the root cause of your health issues, 
            not just the symptoms. Every step is designed to empower your body's natural healing abilities.
          </p>
        </div>

        {/* Method Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={index} className="bg-card/50 border-border/50 hover:shadow-soft hover:scale-105 transition-all duration-300 group">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-healing flex items-center justify-center group-hover:animate-glow">
                  <step.icon className={`w-8 h-8 ${step.color}`} />
                </div>
                <CardTitle className="font-serif text-xl">{step.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results Section */}
        <div className="bg-gradient-healing rounded-3xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="font-serif text-3xl font-bold text-secondary-foreground mb-4">
              Real Results Without Medicine
            </h3>
            <p className="text-secondary-foreground/90 text-lg">
              Witness the transformation that happens when you heal from the root cause
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {results.map((result, index) => (
              <div key={index} className="flex items-center gap-3 bg-background/20 backdrop-blur-sm rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-accent-warm flex-shrink-0" />
                <span className="text-secondary-foreground font-medium">{result}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="wellness" size="xl" className="bg-background text-foreground hover:bg-background/90">
              Discover How It Works
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default MethodSection