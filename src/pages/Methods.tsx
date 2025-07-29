import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Leaf, 
  Brain, 
  Heart, 
  Apple, 
  Flower, 
  Sun, 
  Download,
  Play
} from "lucide-react"

const Methods = () => {
  const methods = [
    {
      icon: Leaf,
      title: "Ayurveda",
      description: "Ancient Indian system of medicine focusing on balance of mind, body, and consciousness through personalized treatments.",
      details: [
        "Constitutional assessment (Prakriti analysis)",
        "Herbal medicine prescriptions",
        "Panchakarma detoxification",
        "Lifestyle recommendations",
        "Dietary guidelines based on your dosha"
      ],
      color: "text-green-600"
    },
    {
      icon: Brain,
      title: "Mindfulness & Meditation",
      description: "Evidence-based practices to reduce stress, improve mental clarity, and promote emotional wellbeing.",
      details: [
        "Guided meditation sessions",
        "Mindful breathing techniques",
        "Stress reduction protocols",
        "Emotional regulation training",
        "Daily mindfulness practices"
      ],
      color: "text-purple-600"
    },
    {
      icon: Heart,
      title: "Holistic Counseling",
      description: "Compassionate guidance addressing emotional and psychological aspects of healing.",
      details: [
        "One-on-one counseling sessions",
        "Trauma-informed care",
        "Cognitive behavioral techniques",
        "Emotional healing support",
        "Life transition guidance"
      ],
      color: "text-pink-600"
    },
    {
      icon: Apple,
      title: "Nutritional Medicine",
      description: "Food as medicine approach with personalized nutrition plans for optimal health.",
      details: [
        "Comprehensive nutritional assessment",
        "Personalized meal plans",
        "Supplement recommendations",
        "Digestive health optimization",
        "Weight management guidance"
      ],
      color: "text-orange-600"
    },
    {
      icon: Flower,
      title: "Natural Remedies",
      description: "Safe, effective natural treatments using herbs, essential oils, and energy healing.",
      details: [
        "Herbal medicine formulations",
        "Essential oil therapy",
        "Flower essence healing",
        "Homeopathic remedies",
        "Energy healing techniques"
      ],
      color: "text-blue-600"
    },
    {
      icon: Sun,
      title: "Lifestyle Medicine",
      description: "Comprehensive approach to creating healthy habits that support long-term wellness.",
      details: [
        "Sleep optimization strategies",
        "Exercise prescription",
        "Stress management techniques",
        "Environmental toxin reduction",
        "Work-life balance guidance"
      ],
      color: "text-yellow-600"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Healing Methods</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Natural Healing
                </span> Methods & Techniques
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Discover the comprehensive range of evidence-based natural healing methods 
                we use to address the root causes of illness and promote lasting wellness.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="healing" size="lg">
                  <Play className="w-5 h-5" />
                  Watch Introduction Video
                </Button>
                <Button variant="outline" size="lg">
                  <Download className="w-5 h-5" />
                  Download Method Guide
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Methods Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {methods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-secondary/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className={`w-8 h-8 ${method.color}`} />
                          </div>
                          <CardTitle className="text-2xl font-serif">{method.title}</CardTitle>
                        </div>
                        <p className="text-muted-foreground leading-relaxed">
                          {method.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-3 text-foreground">What's Included:</h4>
                        <ul className="space-y-2">
                          {method.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-muted-foreground">{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Integrated Approach */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">
                An Integrated Approach to Healing
              </h2>
              <Card className="p-8 text-left">
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    Rather than using just one method, we create a personalized healing plan 
                    that combines multiple approaches based on your unique needs, constitution, 
                    and health goals.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-primary">1</span>
                      </div>
                      <h3 className="font-semibold mb-2">Assessment</h3>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive evaluation of your physical, mental, and emotional health
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-secondary-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-secondary-accent">2</span>
                      </div>
                      <h3 className="font-semibold mb-2">Personalization</h3>
                      <p className="text-sm text-muted-foreground">
                        Custom treatment plan combining the most effective methods for you
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-accent-warm/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-xl font-bold text-accent-warm">3</span>
                      </div>
                      <h3 className="font-semibold mb-2">Transformation</h3>
                      <p className="text-sm text-muted-foreground">
                        Ongoing support and adjustments as you heal and grow
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Research & Evidence */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Research-Backed Methods
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  All our methods are supported by scientific research and thousands of years 
                  of traditional wisdom.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <div className="text-sm text-muted-foreground">Published Studies</div>
                </div>
                <div className="text-center p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-secondary-accent mb-2">5000+</div>
                  <div className="text-sm text-muted-foreground">Years of Tradition</div>
                </div>
                <div className="text-center p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-accent-warm mb-2">95%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
                <div className="text-center p-6 bg-secondary/10 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-2">100%</div>
                  <div className="text-sm text-muted-foreground">Natural & Safe</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                Ready to Begin Your Healing Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Book a consultation to discover which methods are perfect for your unique needs.
              </p>
              <Button variant="healing" size="xl">
                Book Free Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Methods