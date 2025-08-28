import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"
import { useEffect, useState } from "react"

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      name: "Vrushali Gandhi",
      condition: "Chronic Fatigue & Hormonal Imbalance",
      rating: 5,
      text: "मेघा मॅडम आपली शिकवण्याची पद्धत अतिशय साधी व सोपी आहे त्यामुळे आपल्याकडून शिकण्यास एक वेगळाच आनंद मिळाला योगाच नव्हे तर आपण आहाराबद्दल व डायट बद्दल जी काही माहिती सांगितली ती प्रत्यक्षात कृतीत आणल्यामुळे मला दैनंदिन जीवनात दिवसभर फ्रेशनेसपणा जाणवला व शरीरामध्ये ज्या काही व्याधी होत्या त्या देखील कमी झाल्या तरी निश्चितच सर्वांनी त्यांच्या योगाचा लाभ घ्यावा असे मला वाट",
      result: "100% Energy Restored"
    },
    {
      name: "Priyanka kannadkar", 
      condition: "Mind, body fitness",
      rating: 5,
      text: "I have seen a steady improvement in my health after consulting with Megha Mam. She counsels really well. Diet is easily applicable and yoga class is full of variety, well planned over the week. Her flow of taking the asanas is really appreciable. I am thankful to Megha Mam and all the efforts she is taking to improve the community's overall health.",
      result: ""
    },
    {
      name: "Meera Patel",
      condition: "Anxiety & Sleep Disorders",
      rating: 5,
      text: "The mindfulness techniques and natural remedies Dt. Megha prescribed transformed my mental health. I sleep peacefully now and my anxiety is completely manageable. Her compassionate approach made all the difference.",
      result: "Anxiety-Free Living"
    },
    {
      name: "Rashida Khan",
      condition: "PCOS & Fertility Issues", 
      rating: 5,
      text: "After being told I might never conceive naturally, Dt. Megha's integrated treatment plan helped regulate my PCOS. I'm now a proud mother of a healthy baby girl! Her expertise in women's health is unmatched.",
      result: "Natural Pregnancy Success"
    },
    {
      name: "Sunita Joshi",
      condition: "Arthritis & Joint Pain",
      rating: 5,
      text: "Years of joint pain had limited my mobility. Through Dt. Megha's natural treatments and lifestyle changes, I'm now pain-free and more active than I've been in a decade. No more dependency on painkillers!",
      result: "Complete Pain Relief"
    },
    {
      name: "Kavita Reddy",
      condition: "Skin Issues & Autoimmune Condition",
      rating: 5,
      text: "My severe eczema and autoimmune condition improved dramatically with Dt. Megha's holistic protocol. My skin is clear, my energy is high, and I finally understand how to care for my body naturally.",
      result: "Clear Skin & Immune Balance"
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-secondary/5 via-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge className="mb-4">Success Stories</Badge>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Real Women, <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">Real Results</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover how thousands of women have transformed their health and reclaimed their lives 
              through our natural healing approach.
            </p>
          </div>

          {/* Testimonials Carousel */}
          <div className="relative mb-12">
            <div className="overflow-hidden rounded-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <Card className="p-8 hover:shadow-elegant transition-shadow duration-300 bg-background/80 backdrop-blur-sm">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-6">
                          <Quote className="w-12 h-12 text-primary/30 flex-shrink-0 mt-2" />
                          <div className="flex-1">
                            <div className="flex items-center gap-1 mb-4">
                              {[...Array(testimonial.rating)].map((_, i) => (
                                <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                              ))}
                            </div>
                            <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic">
                              "{testimonial.text}"
                            </p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              <div>
                                <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                                <p className="text-sm text-muted-foreground">{testimonial.condition}</p>
                              </div>
                              <Badge variant="secondary" className="text-sm bg-primary/10 text-primary border-primary/20">
                                {testimonial.result}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-primary scale-125' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
            <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-lg">
<div className="text-3xl font-bold text-orange-500 mb-2">5000+</div>
              <div className="text-sm text-muted-foreground">Lives Transformed</div>
            </div>
            <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold text-accent-warm mb-2">0</div>
              <div className="text-sm text-muted-foreground">Medications Needed</div>
            </div>
            <div className="text-center p-6 bg-background/60 backdrop-blur-sm rounded-lg">
              <div className="text-3xl font-bold text-primary mb-2">24x7</div>
              <div className="text-sm text-muted-foreground">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection