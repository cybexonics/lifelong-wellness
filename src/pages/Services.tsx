import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Heart, 
  Brain, 
  Activity, 
  Zap, 
  Shield, 
  Flower2,
  Bone,
  Smile,
  CheckCircle,
  ArrowRight,
  Phone,
} from "lucide-react"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { sendEmailRequest } from "@/utils/emailService"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Define Apple icon component before using it in the services array
const Apple = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
)

const Services = () => {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    concern: "",
    message: "",
  })

  const services = [
   {
      icon: Apple,
      title: "Disease Reversal Diet",
      description: "Comprehensive nutritional therapy to reverse chronic diseases naturally through personalized meal plans and food as medicine approach.",
      benefits: [
        "Customized meal plans based on your condition",
        "Anti-inflammatory food protocols",
        "Nutrient-dense healing recipes",
        "Gradual dietary transition support"
      ],
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Brain,
      title: "Mood Swings Balance",
      description: "Natural approaches to stabilize emotions and achieve mental equilibrium through mindfulness, nutrition, and lifestyle modifications.",
      benefits: [
        "Emotional regulation techniques",
        "Stress-reducing mindfulness practices",
        "Hormonal balance through nutrition",
        "Sleep optimization strategies"
      ],
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: Activity,
      title: "Diabetes Management",
      description: "Holistic diabetes care focusing on blood sugar regulation, insulin sensitivity, and preventing complications through natural methods.",
      benefits: [
        "Blood sugar stabilization protocols",
        "Insulin sensitivity improvement",
        "Diabetic-friendly meal planning",
        "Natural supplement guidance"
      ],
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      title: "Hypertension Control",
      description: "Natural blood pressure management through dietary changes, stress reduction, and lifestyle modifications without medication dependency.",
      benefits: [
        "DASH diet implementation",
        "Sodium reduction strategies",
        "Stress management techniques",
        "Heart-healthy lifestyle coaching"
      ],
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: Shield,
      title: "Thyroid Optimization",
      description: "Comprehensive thyroid health support addressing hypothyroidism, hyperthyroidism, and autoimmune thyroid conditions naturally.",
      benefits: [
        "Thyroid-supporting nutrition",
        "Hormone balance restoration",
        "Autoimmune protocol guidance",
        "Energy level improvement"
      ],
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    },
    {
      icon: Flower2,
      title: "PCOS Management",
      description: "Specialized treatment for Polycystic Ovary Syndrome focusing on hormonal balance, weight management, and fertility enhancement.",
      benefits: [
        "Hormonal balance restoration",
        "Insulin resistance management",
        "Natural fertility enhancement",
        "Menstrual cycle regulation"
      ],
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: Zap,
      title: "PCOD Management",
      description: "Targeted approach for Polycystic Ovarian Disease with focus on metabolic health, weight management, and symptom relief.",
      benefits: [
        "Metabolic syndrome reversal",
        "Weight management support",
        "Acne and hirsutism treatment",
        "Ovarian function improvement"
      ],
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: Bone,
      title: "Arthritis Relief",
      description: "Natural joint health restoration through anti-inflammatory protocols, pain management, and mobility improvement strategies.",
      benefits: [
        "Joint inflammation reduction",
        "Natural pain relief methods",
        "Mobility improvement exercises",
        "Cartilage health support"
      ],
      color: "text-orange-600",
      bgColor: "bg-orange-50"
    },
    {
      icon: Smile,
      title: "Stress Management",
      description: "Comprehensive stress reduction program combining mindfulness, breathing techniques, and lifestyle modifications for mental wellness.",
      benefits: [
        "Mindfulness meditation training",
        "Breathing technique mastery",
        "Work-life balance strategies",
        "Anxiety reduction protocols"
      ],
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
    // ... (rest of your services array remains the same)
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await sendEmailRequest({
        ...formData,
        type: "callback",
      })

      if (result.success) {
        toast({
          title: "Call Request Sent!",
          description: result.message,
        })
        setFormData({ name: "", email: "", phone: "", concern: "", message: "" })
        setIsCallDialogOpen(false)
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send call request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Our Services</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Natural Healing
                </span> for Every Condition
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Comprehensive holistic treatments for chronic diseases, hormonal imbalances, 
                and lifestyle conditions. Experience the power of natural healing without medication dependency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="healing" size="lg">
                      <Phone className="w-5 h-5" />
                      Book Consultation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl flex items-center gap-2">
                        <Phone className="w-6 h-6 text-primary" />
                        Request a Call Back
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-base">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          className="mt-1 h-12 text-base"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email" className="text-base">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="mt-1 h-12 text-base"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-base">Phone Number *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          className="mt-1 h-12 text-base"
                          disabled={isLoading}
                        />
                      </div>

                      <div>
                        <Label htmlFor="concern" className="text-base">Primary Health Concern *</Label>
                        <select
                          id="concern"
                          name="concern"
                          required
                          value={formData.concern}
                          onChange={handleChange}
                          disabled={isLoading}
                          className="mt-1 w-full p-3 h-12 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 text-base"
                        >
                          <option value="">Select your concern</option>
                          <option value="pcos">PCOS / Hormonal Imbalance</option>
                          <option value="infertility">Fertility Issues</option>
                          <option value="weight">Weight Management</option>
                          <option value="energy">Low Energy / Fatigue</option>
                          <option value="digestive">Digestive Issues</option>
                          <option value="other">Other Health Concerns</option>
                        </select>
                      </div>

                      <div>
                        <Label htmlFor="message" className="text-base">Best time to call</Label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Let us know your preferred time for the call..."
                          rows={3}
                          className="mt-1 text-base"
                          disabled={isLoading}
                        />
                      </div>

                      <Button 
                        type="submit" 
                        variant="healing" 
                        className="w-full h-12 text-lg" 
                        disabled={isLoading}
                      >
                        <CheckCircle className="w-6 h-6 mr-2" />
                        {isLoading ? "Sending..." : "Request Call Back"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
                <a href="/gallery">
  <Button variant="outline" size="lg">
    View Success Stories
    <ArrowRight className="w-5 h-5" />
  </Button>
</a>
              </div>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Specialized Treatment Programs
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Each service is designed to address the root cause of your condition 
                  and provide lasting healing through natural methods.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => {
                  const IconComponent = service.icon
                  return (
                    <Card key={index} className="group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                      <CardHeader>
                        <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className={`w-8 h-8 ${service.color}`} />
                        </div>
                        <CardTitle className="text-xl font-serif">{service.title}</CardTitle>
                        <p className="text-muted-foreground leading-relaxed">
                          {service.description}
                        </p>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-3 text-foreground">What's Included:</h4>
                        <ul className="space-y-2 mb-6">
                          {service.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-muted-foreground">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                              Learn More
                            </Button>
                          </DialogTrigger>
                        </Dialog>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Natural Healing */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">
                Why Choose Natural Healing?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">No Side Effects</h3>
                  <p className="text-muted-foreground">
                    Natural treatments work with your body's healing mechanisms without harmful side effects.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-secondary-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-secondary-accent" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Root Cause Treatment</h3>
                  <p className="text-muted-foreground">
                    We address the underlying causes of disease, not just symptoms, for lasting healing.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-warm/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Smile className="w-8 h-8 text-accent-warm" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Sustainable Results</h3>
                  <p className="text-muted-foreground">
                    Build healthy habits and lifestyle changes that support long-term wellness.
                  </p>
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
                Ready to Start Your Healing Journey?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Book a free consultation to discover which natural treatment approach is perfect for your condition.
              </p>
              <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="healing" size="xl">
                    <Phone className="w-5 h-5" />
                    Book Consultation
                  </Button>
                </DialogTrigger>
              </Dialog>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Services
