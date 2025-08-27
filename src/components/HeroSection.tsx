"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Heart, Phone, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { sendEmailRequest } from "@/utils/emailService"
import heroImage from "@/assets/hero-wellness.jpg"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  concern: z.string().min(1, "Please select a health concern"),
  message: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const HeroSection = () => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      concern: "",
      message: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      // First validate the phone number format
      if (!/^[0-9]{10,}$/.test(data.phone.replace(/\D/g, ""))) {
        throw new Error("Please enter a valid phone number")
      }

      const result = await sendEmailRequest({
        ...data,
        type: "consultation",
      })

      if (result.success) {
        toast({
          title: "Consultation Request Sent!",
          description: "We'll contact you within 24 hours to schedule your session.",
        })
        reset()
        setIsOpen(false)
      } else {
        throw new Error(result.message || "Failed to send request")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send consultation request",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage || "/placeholder.svg"} 
          alt="Wellness and healing" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#e56c2f] text-black px-4 py-2 rounded-full mb-6 animate-fade-in-up">
            <Heart className="w-4 h-4 text-black stroke-[#e56c2f]" />
            <span className="text-sm font-medium">Transform Your Health Naturally</span>
          </div>

          {/* Main Heading */}
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in-up">
            <span className="text-foreground">Heal from the</span>
            <br />
            <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Root</span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in-up max-w-3xl mx-auto leading-relaxed">
            Live pain-free, energetic, and medicine-free — naturally.
            <span className="text-primary font-medium"> Dt. Megha Shaha</span> helps women reverse chronic diseases
            through holistic healing.
          </p>

          {/* CTA */}
          <div className="flex justify-center mb-12 animate-fade-in-up">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="healing" size="xl" className="animate-glow">
                  <Phone className="w-5 h-5" />
                  Book Consultation
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl flex items-center gap-2">
                    <Heart className="w-5 h-5 text-secondary-accent" />
                    Book Your Consultation
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="Your full name"
                      className="mt-1"
                      disabled={isLoading}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="your.email@example.com"
                      className="mt-1"
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                      disabled={isLoading}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="concern">Primary Health Concern *</Label>
                    <select
                      id="concern"
                      {...register("concern")}
                      disabled={isLoading}
                      className="mt-1 w-full p-3 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    >
                      <option value="">Select your concern</option>
                      <option value="pcos">PCOS / Hormonal Imbalance</option>
                      <option value="infertility">Fertility Issues</option>
                      <option value="weight">Weight Management</option>
                      <option value="energy">Low Energy / Fatigue</option>
                      <option value="digestive">Digestive Issues</option>
                      <option value="other">Other Health Concerns</option>
                    </select>
                    {errors.concern && (
                      <p className="mt-1 text-sm text-red-500">{errors.concern.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="message">Tell us about your journey (Optional)</Label>
                    <Textarea
                      id="message"
                      {...register("message")}
                      placeholder="Share your health journey and what you hope to achieve..."
                      rows={3}
                      className="mt-1"
                      disabled={isLoading}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    variant="healing" 
                    size="lg" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 mr-2" />
                        Send Consultation Request
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto text-center animate-fade-in-up">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-primary">1,00,000+</div>
              <div className="text-sm text-muted-foreground">Women to be Educated</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-secondary-accent">100%</div>
              <div className="text-sm text-muted-foreground">Medicine-Free Approach</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-accent-warm">24x7</div>
              <div className="text-sm text-muted-foreground">WhatsApp Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-lotus rounded-full opacity-20 animate-float"></div>
      <div
        className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-nature rounded-full opacity-30 animate-float"
        style={{ animationDelay: "1s" }}
      ></div>
    </section>
  )
}

export default HeroSection