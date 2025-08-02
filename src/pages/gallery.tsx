"use client"

import { useState } from "react"
import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ZoomIn } from "lucide-react"

// Import all your images
import d1 from "../assets/d1.jpg"
import d2 from "../assets/d2.jpg"
import d3 from "../assets/d3.jpg"
import d4 from "../assets/d4.jpg"
import d5 from "../assets/d5.jpg"
import d6 from "../assets/d6.jpg"


const Gallery = () => {
  const galleryImages = [
    {
      id: 1,
      src: d1,
      alt: "Modern Wellness Clinic Reception",
      
    },
    {
      id: 2,
      src: d2,
      alt: "Consultation Room",
      
    },
    {
      id: 3,
      src: d3,
      alt: "Natural Medicines",
      
    },
    {
      id: 4,
      src: d4,
      alt: "Yoga & Meditation Space",
      
    },
    {
      id: 5,
      src: d5,
      alt: "Nutritional Guidance",

     
    },
    {
      id: 6,
      src: d6,
      alt: "Nutritional Guidance",
   
      
    },
   
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="mt-6 pt-24 pb-16 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <span className="text-green-600">Our</span> Gallery
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Take a glimpse into our wellness center, treatment spaces, and the healing environment we've created for
            your journey to optimal health.
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galleryImages.map((image) => (
              <Dialog key={image.id}>
                <DialogTrigger asChild>
                  <div className="group relative overflow-hidden rounded-2xl bg-card shadow-soft hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        {/* <h3 className="font-serif text-xl font-semibold mb-2">{image.title}</h3>
                        <p className="text-sm text-white/90">{image.description}</p> */}
                      </div>

                      {/* Zoom Icon */}
                      <div className="absolute top-4 right-4">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <ZoomIn className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      {/* <Badge variant="secondary" className="bg-white/90 text-foreground">
                        {image.category.charAt(0).toUpperCase() + image.category.slice(1)}
                      </Badge> */}
                    </div>
                  </div>
                </DialogTrigger>

                <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-none">
                  <div className="relative">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    />

                    {/* Image Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                      {/* <h3 className="font-serif text-2xl font-semibold text-white mb-2">{image.title}</h3>
                      <p className="text-white/90">{image.description}</p> */}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
    

      <Footer />
    </div>
  )
}

export default Gallery