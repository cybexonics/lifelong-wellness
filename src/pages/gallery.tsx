import Navigation from "@/components/Navigation"
import Footer from "@/components/Footer"
import { Card, CardContent } from "@/components/ui/card"

const gallerySections = [
  {
    title: "Success Stories",
    images: [
      "/gallery/s1.jpg",
      "/gallery/s2.jpg",
      "/gallery/s3.jpg",
    ],
  },
  {
    title: "Clinic and Facilities",
    images: [
      "/gallery/clinic1.jpg",
      "/gallery/clinic2.jpg",
      "/gallery/clinic3.jpg",
    ],
  },
  {
    title: "Workshops and Events",
    images: [
      "/gallery/event1.jpg",
      "/gallery/event2.jpg",
    ],
  },
]

export default function Gallery() {
  return (
    <div>
      <Navigation />
      <section className="px-4 py-12 md:px-12">
        <h1 className="text-3xl font-bold text-center mb-10 text-green-700">Gallery</h1>
        {gallerySections.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{section.title}</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {section.images.map((src, idx) => (
                <Card key={idx} className="overflow-hidden shadow-lg">
                  <CardContent className="p-0">
                    <img
                      src={src}
                      alt={`Gallery ${idx}`}
                      className="w-full h-60 object-cover"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
      <Footer />
    </div>
  )
}


