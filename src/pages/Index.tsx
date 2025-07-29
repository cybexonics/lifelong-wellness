"use client"

import type React from "react"

import Navigation from "@/components/Navigation"
import HeroSection from "@/components/HeroSection"
import TestimonialsSection from "@/components/TestimonialsSection"
import BookingForm from "@/components/BookingForm"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Users, Award, Heart, CheckCircle, Calendar, Phone, Upload, X, CreditCard } from "lucide-react"
import { Link } from "react-router-dom"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

const Index = () => {
  const { toast } = useToast()
  const [isFlipped, setIsFlipped] = useState(false)
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create FormData to handle file upload
      const submitData = new FormData()
      submitData.append("fullName", formData.name)
      submitData.append("email", formData.email)
      submitData.append("phone", formData.phone)
      submitData.append("message", formData.message)
      submitData.append("type", "consultation")
      submitData.append("consultationType", "First Consultation Discount")

      if (paymentScreenshot) {
        submitData.append("paymentScreenshot", paymentScreenshot)
      }

      console.log("Submitting consultation request...")

      const response = await fetch("http://localhost:3001/api/send-email", {
        method: "POST",
        body: submitData,
      })

      const data = await response.json()

      if (response.ok && data.success) {
        toast({
          title: "🎉 Consultation Request Sent!",
          description:
            "We'll contact you within 24 hours to schedule your discounted consultation. Check your email for confirmation!",
        })
        setFormData({ name: "", email: "", phone: "", message: "" })
        setPaymentScreenshot(null)
        setIsFlipped(false)
      } else {
        throw new Error(data.message || "Failed to send consultation request")
      }
    } catch (error) {
      console.error("Consultation request error:", error)
      toast({
        title: "❌ Error",
        description: error instanceof Error ? error.message : "Failed to send consultation request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG, JPG, etc.)",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        })
        return
      }

      setPaymentScreenshot(file)
      toast({
        title: "✅ File uploaded",
        description: "Payment screenshot uploaded successfully!",
      })
    }
  }

  const removeFile = () => {
    setPaymentScreenshot(null)
    toast({
      title: "File removed",
      description: "Payment screenshot removed. Please upload again.",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section id="home" className="mt-6">
          <HeroSection />
        </section>

        {/* Brief About Section */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - About Dr. Megha */}
                <div className="text-center lg:text-left">
                  <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                    Meet{" "}
                    <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                      Dr. Megha Shaha
                    </span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    A dedicated healer with over 10 years of experience in holistic medicine, helping women achieve
                    optimal health through natural, evidence-based treatments.
                  </p>
                  <Link to="/about">
                    <Button variant="nature" size="lg">
                      Learn More About Dr. Megha
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>

                {/* Right Side - Consultation Offer Card with Flip */}
                <div className="flex justify-center">
                  <div className="relative w-full max-w-md h-[36rem] perspective-1000">
                    <div
                      className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                        isFlipped ? "rotate-y-180" : ""
                      }`}
                    >
                      {/* Front Side - Offer */}
                      <Card className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-primary/10 via-secondary/20 to-accent/10 border-2 border-primary/20 shadow-glow">
                        <CardContent className="p-6 h-full flex flex-col justify-between">
                          <div>
                            <div className="text-center mb-4">
                              <div className="flex flex-col items-center mb-2">
                                <div className="relative">
                                  <span className="text-lg text-muted-foreground line-through mr-2">₹1000</span>
                                  <div className="absolute -top-3 -right-3 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                                    -50%
                                  </div>
                                </div>
                                <div className="text-3xl font-bold text-primary mt-1">₹499</div>
                              </div>
                              <h3 className="font-serif text-2xl font-bold text-primary mb-2">
                                First Health Consultation!
                              </h3>
                              <p className="text-sm text-muted-foreground">Limited time introductory offer</p>
                            </div>

                            <div className="space-y-3 mb-6">
                              <p className="text-center text-muted-foreground mb-4">
                                In this consultation, you will get:
                              </p>
                              {[
                                "Root Cause Diagnosis",
                                "Blood Report Analysis",
                                "Weight Check",
                                "Body Measurements",
                                "Diet & Exercise Guidance",
                                "Ideal Body Weight (IBW) Advice",
                                "Healthy Lifestyle Recommendations",
                              ].map((item, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                                  <span className="text-sm text-foreground">{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-4">
                              Take the first step towards a healthier you!
                            </p>
                            <div className="mt-6">
                              <Button variant="healing" size="lg" className="w-full" onClick={() => setIsFlipped(true)}>
                                <Calendar className="w-4 h-4" />
                                Book Now for ₹499
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Back Side - Booking Form with QR Code */}
                      <Card className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-background border-2 border-primary/20 shadow-glow overflow-y-auto">
                        <CardContent className="p-4 h-full flex flex-col">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-serif text-lg font-bold text-primary">Book Your Consultation</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setIsFlipped(false)}
                              disabled={isSubmitting}
                            >
                              ← Back
                            </Button>
                          </div>

                          {/* QR Code Payment Section */}
                          <div className="text-center mb-4 p-4 bg-gradient-to-br from-primary/5 to-secondary/10 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <CreditCard className="w-5 h-5 text-primary" />
                              <h4 className="font-semibold text-sm text-primary">Pay ₹499 for First Consultation</h4>
                            </div>

                            <div className="flex justify-center mb-3">
                              <div className="relative">
                                <img
                                  src="/images/qr-code-payment.png"
                                  alt="Payment QR Code"
                                  className="w-28 h-28 border-2 border-primary/30 rounded-lg shadow-md"
                                />
                                <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">
                                  ₹499
                                </div>
                              </div>
                            </div>

                            <div className="space-y-1">
                              <p className="text-xs text-muted-foreground">Scan QR code to pay via UPI</p>
                              <p className="text-xs font-medium text-primary">UPI ID: drmeghashaha@paytm</p>
                              <p className="text-xs text-orange-600 font-medium">⚡ Instant Payment • Secure</p>
                            </div>
                          </div>

                          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
                            <div className="space-y-3 flex-1">
                              <div>
                                <Label htmlFor="name" className="text-xs font-medium">
                                  Full Name *
                                </Label>
                                <Input
                                  id="name"
                                  name="name"
                                  type="text"
                                  required
                                  value={formData.name}
                                  onChange={handleChange}
                                  className="mt-1 h-9 text-sm"
                                  placeholder="Enter your full name"
                                  disabled={isSubmitting}
                                />
                              </div>

                              <div>
                                <Label htmlFor="email" className="text-xs font-medium">
                                  Email Address *
                                </Label>
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  required
                                  value={formData.email}
                                  onChange={handleChange}
                                  className="mt-1 h-9 text-sm"
                                  placeholder="your.email@example.com"
                                  disabled={isSubmitting}
                                />
                              </div>

                              <div>
                                <Label htmlFor="phone" className="text-xs font-medium">
                                  Phone Number *
                                </Label>
                                <Input
                                  id="phone"
                                  name="phone"
                                  type="tel"
                                  required
                                  value={formData.phone}
                                  onChange={handleChange}
                                  className="mt-1 h-9 text-sm"
                                  placeholder="+91 98765 43210"
                                  disabled={isSubmitting}
                                />
                              </div>

                              <div>
                                <Label htmlFor="message" className="text-xs font-medium">
                                  Health Concerns (Optional)
                                </Label>
                                <Textarea
                                  id="message"
                                  name="message"
                                  value={formData.message}
                                  onChange={handleChange}
                                  className="mt-1 text-sm"
                                  rows={2}
                                  placeholder="Brief description of your health goals..."
                                  disabled={isSubmitting}
                                />
                              </div>

                              {/* Payment Screenshot Upload */}
                              <div>
                                <Label htmlFor="payment-screenshot" className="text-xs font-medium">
                                  Payment Screenshot *
                                </Label>
                                <div className="mt-1">
                                  {!paymentScreenshot ? (
                                    <div className="border-2 border-dashed border-primary/30 rounded-lg p-3 text-center hover:border-primary/50 transition-colors">
                                      <input
                                        id="payment-screenshot"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        required
                                        disabled={isSubmitting}
                                      />
                                      <label
                                        htmlFor="payment-screenshot"
                                        className={`cursor-pointer flex flex-col items-center gap-1 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                      >
                                        <Upload className="w-6 h-6 text-primary/60" />
                                        <span className="text-xs text-muted-foreground">Upload payment screenshot</span>
                                        <span className="text-xs text-primary font-medium">Click to browse</span>
                                      </label>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-green-800 truncate">
                                          {paymentScreenshot.name}
                                        </p>
                                        <p className="text-xs text-green-600">
                                          {(paymentScreenshot.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={removeFile}
                                        className="h-6 w-6 p-0 hover:bg-red-100"
                                        disabled={isSubmitting}
                                      >
                                        <X className="w-3 h-3 text-red-500" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  📸 Upload screenshot after making ₹499 payment
                                </p>
                              </div>
                            </div>

                            <div className="mt-4 space-y-2">
                              <Button
                                type="submit"
                                variant="healing"
                                size="lg"
                                className="w-full h-10"
                                disabled={isSubmitting}
                              >
                                {isSubmitting ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Sending Request...
                                  </>
                                ) : (
                                  <>
                                    <Phone className="w-4 h-4" />
                                    Submit Consultation Request
                                  </>
                                )}
                              </Button>
                              <p className="text-xs text-muted-foreground text-center">
                                🕐 We'll contact you within 24 hours
                              </p>
                              <p className="text-xs text-green-600 text-center font-medium">
                                ✅ Auto-confirmation email will be sent
                              </p>
                            </div>
                          </form>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Unique Approach */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
                  Our{" "}
                  <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                    Unique Approach
                  </span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  We don't just treat symptoms - we address the root causes of illness through a comprehensive,
                  personalized approach to healing.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 text-center hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="p-0">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-3">Personalized Care</h3>
                    <p className="text-muted-foreground">
                      Every treatment plan is uniquely designed based on your individual constitution, health history,
                      and specific needs.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 text-center hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="p-0">
                    <Award className="w-12 h-12 text-secondary-accent mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-3">Evidence-Based</h3>
                    <p className="text-muted-foreground">
                      Our methods combine ancient wisdom with modern science, backed by research and proven results.
                    </p>
                  </CardContent>
                </Card>

                <Card className="p-6 text-center hover:shadow-elegant transition-shadow duration-300">
                  <CardContent className="p-0">
                    <Heart className="w-12 h-12 text-accent-warm mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-semibold mb-3">Holistic Healing</h3>
                    <p className="text-muted-foreground">
                      We treat the whole person - mind, body, and spirit - for lasting transformation and optimal
                      wellness.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links Section */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Explore Our Services</h2>
                <p className="text-muted-foreground">Discover how we can help you achieve lasting wellness</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <h3 className="font-serif text-2xl font-semibold mb-4">About Dr. Megha</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Learn about Dr. Megha's journey, education, and passion for holistic healing. Discover why
                      thousands of women trust her with their health.
                    </p>
                    <Link to="/about">
                      <Button variant="outline">
                        Read Full Story
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="p-8 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-0">
                    <h3 className="font-serif text-2xl font-semibold mb-4">Methods & Techniques</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Explore our comprehensive range of natural healing methods including Ayurveda, mindfulness,
                      nutrition, and lifestyle medicine.
                    </p>
                    <Link to="/methods">
                      <Button variant="outline">
                        Explore Methods
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <BookingForm />
      </main>

      <Footer />
    </div>
  )
}

export default Index