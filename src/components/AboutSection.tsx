import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Heart, Users, Target } from "lucide-react"
import DoctorImage from "@/assets/doctor.jpg"

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="relative w-full max-w-md mx-auto">
              <img 
                src={DoctorImage} 
                alt="Dr. Megha Shaha" 
                className="w-full h-auto rounded-2xl shadow-warm"
              />
              <div className="absolute -bottom-6 -right-6 bg-gradient-primary p-4 rounded-2xl shadow-soft">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <div className="absolute -top-4 -left-4 bg-secondary p-3 rounded-xl shadow-warm">
                <Award className="w-6 h-6 text-secondary-accent" />
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                Meet <span className="text-primary">Dr. Megha Shaha</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                From a gym shutdown during COVID to discovering her true calling — Dr. Megha's journey began with a profound realization that healing comes from within, not from medicine bottles.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                After losing her mother and witnessing countless women suffer in silence, she dedicated her life to ensuring no woman has to endure chronic pain without hope for natural healing.
              </p>
            </div>

            {/* Mission Statement */}
            <Card className="bg-gradient-healing border-0 shadow-warm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Target className="w-8 h-8 text-secondary-accent mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-serif text-xl font-semibold mb-2 text-secondary-foreground">Mission</h3>
                    <p className="text-secondary-foreground/90">
                      To educate 1,00,000 women worldwide about the power of natural healing and help them reclaim their health without dependency on medications.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-card/50 border-border/50 hover:shadow-soft transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Award className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-sm font-medium">Certified Nutritionist</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 hover:shadow-soft transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Heart className="w-6 h-6 text-secondary-accent mx-auto mb-2" />
                  <div className="text-sm font-medium">Yoga Expert</div>
                </CardContent>
              </Card>
              <Card className="bg-card/50 border-border/50 hover:shadow-soft transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-accent-warm mx-auto mb-2" />
                  <div className="text-sm font-medium">Naturopathy Specialist</div>
                </CardContent>
              </Card>
            </div>

            <Button variant="healing" size="lg" className="w-full sm:w-auto">
              Learn About My Approach
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection