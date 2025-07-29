"use client"

import React, { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { sendEmailRequest } from "@/utils/emailService"
import { Menu, Phone, CheckCircle } from "lucide-react"
import logoImage from "@/assets/logo.png" // Make sure this path is correct

// UI Components
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const location = useLocation()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    concern: "",
    message: "",
  })

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Methods", href: "/methods" },
    { name: "Contact", href: "/contact" },
  ]

  const scrollToBooking = () => {
    if (location.pathname === "/") {
      const element = document.querySelector("#booking")
      if (element) element.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = "/#booking"
    }
    setIsOpen(false)
  }

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20"> {/* Extra tall navbar */}
          {/* Logo - Very large size */}
          <Link to="/" className="flex items-center gap-4">
            <img 
              src={logoImage} 
              alt="Lifelong Wellness" 
              className="w-20 h-20 object-contain" // Very large logo
            />
            <div className="ml-2"> {/* Added margin for better spacing */}
              <h1 className="font-serif font-semibold text-2xl text-foreground">Lifelong Wellness</h1>
              <p className="text-sm text-muted-foreground mt-1">Dr. Megha Shaha</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10"> {/* Increased gap */}
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-lg text-foreground hover:text-primary transition-colors duration-200 font-medium ${
                  location.pathname === item.href ? "text-primary" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="healing" className="px-6 py-3 text-lg"> {/* Larger button */}
                  <Phone className="w-5 h-5 mr-2" />
                  Book Call
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
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-12 w-12">
                <Menu className="w-8 h-8" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] bg-background">
              <div className="flex flex-col gap-8 mt-10">
                <div className="flex items-center gap-4 pb-8 border-b border-border">
                  <img
                    src={logoImage}
                    alt="Lifelong Wellness"
                    className="w-24 h-24 object-contain" // Extra large mobile logo
                  />
                  <div>
                    <h1 className="font-serif font-semibold text-2xl text-foreground">Lifelong Wellness</h1>
                    <p className="text-sm text-muted-foreground mt-1">Dr. Megha Shaha</p>
                  </div>
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-xl text-foreground hover:text-primary transition-colors duration-200 py-3 block ${
                      location.pathname === item.href ? "text-primary" : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="pt-8 border-t border-border">
                  <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="healing" 
                        className="w-full h-14 text-lg"
                        onClick={() => setIsOpen(false)}
                      >
                        <Phone className="w-6 h-6 mr-2" />
                        Book Call Back
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
                          <Label htmlFor="mobile-name" className="text-base">Full Name *</Label>
                          <Input
                            id="mobile-name"
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
                          <Label htmlFor="mobile-email" className="text-base">Email Address *</Label>
                          <Input
                            id="mobile-email"
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
                          <Label htmlFor="mobile-phone" className="text-base">Phone Number *</Label>
                          <Input
                            id="mobile-phone"
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
                          <Label htmlFor="mobile-concern" className="text-base">Primary Health Concern *</Label>
                          <select
                            id="mobile-concern"
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
                          <Label htmlFor="mobile-message" className="text-base">Best time to call</Label>
                          <Textarea
                            id="mobile-message"
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
                          className="w-full h-14 text-lg"
                          disabled={isLoading}
                        >
                          <CheckCircle className="w-6 h-6 mr-2" />
                          {isLoading ? "Sending..." : "Request Call Back"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}

export default Navigation