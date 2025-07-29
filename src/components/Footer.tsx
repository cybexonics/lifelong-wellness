import { Heart, Mail, MessageCircle, Instagram, Youtube, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoImage from "@/assets/logo.png"
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

const Footer = () => {
  const navigate = useNavigate();
  
  // Social media links
  const socialLinks = {
    facebook: "https://www.facebook.com/share/18WfXH6g4m/",
    instagram: "https://www.instagram.com/megha_shaha83?igsh=d3ZicGhjZXE0czZ4",
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
                <p className="text-sm text-muted-foreground">Dr. Megha Shaha</p>
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
              {["About Dr. Megha", "Healing Method", "Success Stories", "Free Resources", "Programs"].map((link) => (
                <div key={link}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                    {link}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <div className="space-y-2">
              {["PCOS Reversal", "Fertility Enhancement", "Weight Management", "Hormonal Balance", "Detox Programs"].map((service) => (
                <div key={service}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
                    {service}
                  </a>
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
            © 2024 Lifelong Wellness by Dr. Megha Shaha. All rights reserved. 
            <span className="text-primary"> Heal naturally, live beautifully.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer