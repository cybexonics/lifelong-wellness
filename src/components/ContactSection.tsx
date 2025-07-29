import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MessageCircle, Calendar, Heart } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const ContactSection = () => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    concern: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Message Sent!",
      description: "Dr. Megha will get back to you within 24 hours.",
    })
    setFormData({ name: '', email: '', phone: '', concern: '', message: '' })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-primary">Transform Your Health?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Take the first step towards natural healing. Book your free consultation 
            and discover how to reverse your condition naturally.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="bg-card shadow-soft border-border/50">
            <CardHeader>
              <CardTitle className="font-serif text-2xl text-center flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-secondary-accent" />
                Book Your Free Consultation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Your phone number"
                      required
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Primary Health Concern</label>
                  <select
                    name="concern"
                    value={formData.concern}
                    onChange={handleChange}
                    required
                    className="mt-1 w-full p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
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
                  <label className="text-sm font-medium text-muted-foreground">Tell us about your journey</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Share your health journey and what you hope to achieve..."
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" variant="healing" size="lg" className="w-full">
                  <Calendar className="w-5 h-5" />
                  Book Free Consultation
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info & CTAs */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-gradient-primary border-0 text-primary-foreground hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-foreground/20 rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Call Directly</h3>
                      <p className="opacity-90">Immediate consultation available</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-secondary border-secondary-accent/20 hover:shadow-warm transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-secondary-accent/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-secondary-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-secondary-foreground">WhatsApp Support</h3>
                      <p className="text-secondary-foreground/80">24x7 guidance and support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-accent/10 border-accent/20 hover:shadow-soft transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Email Us</h3>
                      <p className="text-muted-foreground">info@lifelongwellness.in</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trust Indicators */}
            <Card className="bg-gradient-healing border-0">
              <CardContent className="p-6 text-center">
                <h3 className="font-serif text-xl font-semibold text-secondary-foreground mb-4">
                  Why Choose Natural Healing?
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-secondary-foreground/90">
                    <Heart className="w-4 h-4 text-accent-warm" />
                    <span>No side effects or dependency</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-secondary-foreground/90">
                    <Heart className="w-4 h-4 text-accent-warm" />
                    <span>Addresses root cause, not symptoms</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-secondary-foreground/90">
                    <Heart className="w-4 h-4 text-accent-warm" />
                    <span>Sustainable, lifelong wellness</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection