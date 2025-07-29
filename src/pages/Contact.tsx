"use client"

import type React from "react"

import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, Clock, MessageSquare, Calendar, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

const Contact = () => {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    phone: "",
    consultationType: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const fullName = `${formData.name} ${formData.surname}`.trim()
      const submitData = {
        fullName,
        email: formData.email,
        phone: formData.phone,
        consultationType: formData.consultationType,
        message: formData.message,
        type: "contact",
      }

      console.log("Submitting contact form:", submitData)

      const response = await fetch("http://localhost:3001/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "🎉 Success!",
          description:
            "Your message has been sent successfully. We'll respond within 2 hours. Check your email for confirmation!",
        })
        setFormData({
          name: "",
          surname: "",
          email: "",
          phone: "",
          consultationType: "",
          message: "",
        })
      } else {
        throw new Error(data.message || "Failed to send message")
      }
    } catch (error) {
      console.error("Contact form error:", error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4">Get In Touch</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Let's Start Your{" "}
                <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                  Healing Journey
                </span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Ready to transform your health naturally? Get in touch to schedule your free consultation and discover
                how we can help you achieve lasting wellness.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information & Form */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <h2 className="font-serif text-3xl font-bold mb-6">Get In Touch</h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                      We're here to support you on your wellness journey. Reach out through any of these channels and
                      we'll respond promptly.
                    </p>
                  </div>

                  {/* Contact Cards */}
                  <div className="space-y-4">
                    <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <Phone className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Phone</h3>
                            <p className="text-muted-foreground">+91 94210 69326</p>
                            <p className="text-sm text-primary">Call for immediate assistance</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-secondary-accent/10 rounded-full">
                            <MessageSquare className="w-6 h-6 text-secondary-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">WhatsApp</h3>
                            <p className="text-muted-foreground">+91 94210 69326</p>
                            <p className="text-sm text-secondary-accent">24x7 Support Available</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-accent-warm/10 rounded-full">
                            <Mail className="w-6 h-6 text-accent-warm" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Email</h3>
                            <p className="text-muted-foreground">meghahshaha@gmail.com</p>
                            <p className="text-sm text-accent-warm">We respond within 2 hours</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-full">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Clinic Address</h3>
                            <p className="text-muted-foreground">123 Wellness Street, Health District</p>
                            <p className="text-muted-foreground">Mumbai, Maharashtra 400001</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="p-6 hover:shadow-elegant transition-shadow duration-300">
                      <CardContent className="p-0">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-secondary-accent/10 rounded-full">
                            <Clock className="w-6 h-6 text-secondary-accent" />
                          </div>
                          <div>
                            <h3 className="font-semibold mb-1">Working Hours</h3>
                            <p className="text-muted-foreground">Monday - Saturday: 9:00 AM - 7:00 PM</p>
                            <p className="text-muted-foreground">Sunday: 10:00 AM - 4:00 PM</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Consultation Form */}
                <div>
                  <Card className="p-8">
                    <CardHeader className="p-0 mb-6">
                      <CardTitle className="font-serif text-2xl flex items-center gap-2">
                        <Calendar className="w-6 h-6 text-primary" />
                        Book Your Free Consultation
                      </CardTitle>
                      <p className="text-muted-foreground">
                        Fill out the form below and we'll contact you to schedule your personalized consultation.
                      </p>
                    </CardHeader>
                    <CardContent className="p-0">
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="name">First Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              type="text"
                              required
                              value={formData.name}
                              onChange={handleChange}
                              className="mt-1"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <Label htmlFor="surname">Last Name *</Label>
                            <Input
                              id="surname"
                              name="surname"
                              type="text"
                              required
                              value={formData.surname}
                              onChange={handleChange}
                              className="mt-1"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1"
                            disabled={isSubmitting}
                          />
                        </div>

                        <div>
                          <Label htmlFor="consultationType">Preferred Consultation Type *</Label>
                          <select
                            id="consultationType"
                            name="consultationType"
                            required
                            value={formData.consultationType}
                            onChange={handleChange}
                            disabled={isSubmitting}
                            className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select consultation type</option>
                            <option value="online">Online Consultation</option>
                            <option value="offline">In-Person Consultation</option>
                            <option value="either">Either (I'm flexible)</option>
                          </select>
                        </div>

                        <div>
                          <Label htmlFor="message">Message / Reason for Consultation</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            className="mt-1"
                            rows={4}
                            placeholder="Tell us about your health concerns or goals..."
                            disabled={isSubmitting}
                          />
                        </div>

                        <Button
                          type="submit"
                          variant="healing"
                          size="lg"
                          className="w-full"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending Message...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Submit Consultation Request
                            </>
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Visit Our Clinic</h2>
                <p className="text-muted-foreground">Located in the heart of the city for your convenience</p>
              </div>
              <div className="bg-muted rounded-2xl h-96 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Interactive Map</h3>
                  <p className="text-muted-foreground">Google Maps integration would be placed here</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Contact
