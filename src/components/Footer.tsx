import { Heart, Mail, MessageCircle, Instagram, Youtube, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoImage from "@/assets/logo.png"
import { FaGoogle } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom"; // Import useNavigate for navigation

const Footer = () => {
  const navigate = useNavigate();
  
  // Social media links
  const socialLinks = {
    facebook: "https://www.facebook.com/share/18WfXH6g4m/",
    instagram: "https://www.instagram.com/fitnness_coach_megha_shaha?igsh=ZWR2ajd2enlvMmoz",
    youtube: "https://youtube.com/@meghashaha1156?si=fePkXyIeNJDhiesm",
    googleBusiness: "https://g.co/kgs/ezHLMBB"
  };

  // WhatsApp function
  const openWhatsApp = () => {
    window.open(`https://wa.me/919421069326`, '_blank');
  };

  // Navigate to contact page
  const goToContactPage = () => {
    navigate('/contact');
  };

  return (
    <footer className="bg-gradient-to-t from-muted/50 to-background border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={LogoImage} alt="Lifelong Wellness" className="w-12 h-12 rounded-full" /> {/* Increased size */}
              <div>
                <h3 className="font-serif font-semibold text-lg">Lifelong Wellness</h3>
                <p className="text-sm text-muted-foreground">DT. Megha Shaha</p>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Empowering women to heal naturally and live medicine-free lives through holistic wellness.
            </p>
            <div className="flex items-center gap-2 text-sm text-primary">
              <Heart className="w-4 h-4" />
              <span>Heal from the root</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              {[
                { label: "About Dr. Megha", to: "/about" },
                { label: "Healing Method", to: "/method" },
                { label: "Success Stories", to: "/about" },
                { label: "Free Resources", to: "/about" },
                { label: "Programs", to: "/about" },
              ].map((link) => (
                <div key={link.label}>
                  <Link
                    to={link.to}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              {[
                { label: "PCOS Reversal", to: "/services" },
                { label: "Fertility Enhancement", to: "/services" },
                { label: "Weight Management", to: "/services" },
                { label: "Hormonal Balance", to: "/services" },
                { label: "Detox Programs", to: "/services" },
              ].map((service) => (
                <div key={service.label}>
                  <Link
                    to={service.to}
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    {service.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <span className="text-sm">meghahshaha@gmail.com</span>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="wellness" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={openWhatsApp}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Support
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={goToContactPage}
                >
                  <Phone className="w-4 h-4" />
                  Book Consultation
                </Button>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-blue-600" 
                  asChild
                >
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-pink-600" 
                  asChild
                >
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-red-600" 
                  asChild
                >
                  <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="w-5 h-5" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-blue-500" 
                  asChild
                >
                  <a href={socialLinks.googleBusiness} target="_blank" rel="noopener noreferrer">
                    <FaGoogle className="w-5 h-5" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
  © 2025 Lifelong Wellness by DT. Megha Shaha, Cybexonics IT Consultants Pvt. Ltd.
  <br />
  All rights reserved. Heal naturally, live beautifully.
  <br />
  Designed by{" "}
  <a 
    href="https://cybexonics.com" 
    className="text-primary hover:underline"
    target="_blank" 
    rel="noopener noreferrer"
  >
    @Cybexonics IT Consultants Pvt. Ltd.
  </a>
</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer