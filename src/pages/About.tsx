import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Heart, Award, Users } from "lucide-react"
import DoctorImage from "@/assets/doctor.jpg"

const About = () => {
  const education = [
    { degree: "MBBS", institution: "Medical College", year: "2010" },
    { degree: "MD in Holistic Medicine", institution: "Holistic Health University", year: "2014" },
    { degree: "Certified Ayurveda Practitioner", institution: "Ayurveda Institute", year: "2015" },
    { degree: "Mindfulness & Meditation Certification", institution: "Wellness Academy", year: "2016" }
  ]

  const experience = [
    { role: "Chief Holistic Practitioner", place: "Lifelong Wellness Clinic", years: "2018 - Present" },
    { role: "Senior Wellness Consultant", place: "Natural Health Center", years: "2015 - 2018" },
    { role: "Resident Doctor", place: "City General Hospital", years: "2012 - 2015" }
  ]

  const certifications = [
    "Board Certified in Holistic Medicine",
    "Certified Ayurveda Specialist",
    "Licensed Mindfulness Instructor",
    "Certified Nutritional Counselor",
    "Women's Health Specialist"
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background via-secondary/20 to-background">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <Badge className="mb-4">About Dr. Megha</Badge>
                  <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">
                    Dedicated to <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Holistic Healing</span>
                  </h1>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Hello! I'm Dr. Megha Shaha, founder of Lifelong Wellness.
                    I'm a disease reversal nutritionist, yoga trainer, and naturopathy expert. After losing my mother
                    to illness despite medical treatment, I made it my mission to help women heal naturally without medicine.
                    I work with women struggling with lifestyle diseases like PCOS, acidity, and infertility,
                    using food as medicine, yoga, and mindset coaching. My goal is to build a strong, empowered community of 
                    women who live pain-free, emotionally strong, and joyfully healthy lives-starting from their own kitchen and self-belief.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">10+</div>
                      <div className="text-sm text-muted-foreground">Years Experience</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-secondary-accent">5000+</div>
                      <div className="text-sm text-muted-foreground">Lives Transformed</div>
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={DoctorImage} 
                    alt="Dr. Megha Shaha" 
                    className="w-full max-w-md mx-auto rounded-2xl shadow-elegant"
                  />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-lotus rounded-full opacity-20"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Mission & Vision</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              <Card className="p-8 hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-0">
                  <Heart className="w-12 h-12 text-primary mb-4" />
                  <h3 className="font-serif text-2xl font-semibold mb-4">Our Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To empower women to achieve optimal health through natural, holistic approaches 
                    that address the root causes of illness rather than just symptoms. We believe 
                    in the body's innate ability to heal when given the right support.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-8 hover:shadow-elegant transition-shadow duration-300">
                <CardContent className="p-0">
                  <Award className="w-12 h-12 text-secondary-accent mb-4" />
                  <h3 className="font-serif text-2xl font-semibold mb-4">Our Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To create a world where every woman has access to natural, effective healthcare 
                    that honors the mind-body connection and promotes lifelong wellness without 
                    dependency on medications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Education */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <GraduationCap className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Education & Training</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Continuous learning and expertise in both conventional and holistic medicine
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {education.map((item, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="p-0">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{item.degree}</h3>
                          <p className="text-muted-foreground">{item.institution}</p>
                          <p className="text-sm text-primary font-medium">{item.year}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Users className="w-16 h-16 text-secondary-accent mx-auto mb-4" />
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Professional Experience</h2>
              </div>
              <div className="space-y-6">
                {experience.map((item, index) => (
                  <Card key={index} className="p-6 hover:shadow-elegant transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-xl mb-2">{item.role}</h3>
                          <p className="text-muted-foreground">{item.place}</p>
                        </div>
                        <Badge variant="secondary">{item.years}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-secondary/10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-background rounded-lg">
                    <Award className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-left">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why This Path */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8">Why I Chose This Healing Path</h2>
              <Card className="p-8 text-left">
                <CardContent className="p-0">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    "My journey into holistic medicine began during my conventional medical training 
                    when I witnessed the limitations of treating symptoms without addressing root causes. 
                    I saw patients getting temporary relief but never truly healing."
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                    "This led me to explore ancient healing systems like Ayurveda, mindfulness practices, 
                    and nutritional medicine. I discovered that when we honor the body's natural wisdom 
                    and address the whole person - mind, body, and spirit - profound healing becomes possible."
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    "Today, I'm passionate about empowering women to reclaim their health naturally, 
                    breaking free from the cycle of dependency on medications and truly thriving in 
                    all aspects of their lives."
                  </p>
                  <div className="mt-8 text-right">
                    <p className="font-serif text-xl font-semibold text-primary">- Dr. Megha Shaha</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default About
