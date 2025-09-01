import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Building, Users, Coffee, Laptop, X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const locations = [
    {
      title: "Bengaluru Branch Office",
      address: "BMTC Complex, Outer Ring Rd, Old Madiwala, Kuvempu Nagar, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560068",
      images: [
        {
          url: "/lovable-uploads/8c10229f-df92-4663-affd-fb5ac9fc2261.png",
          caption: "Modern Workspace with Colorful Workstations",
          type: "workspace"
        },
        {
          url: "/lovable-uploads/85a18ab5-e051-4863-bd31-1d27be471b49.png",
          caption: "Corporate Building Exterior",
          type: "building"
        },
        {
          url: "/lovable-uploads/cbe8c4fb-7337-47c0-87ca-8ef86b8b4fcd.png",
          caption: "Meeting Rooms with Red Glass Walls",
          type: "meeting"
        },
        {
          url: "/lovable-uploads/eb3fa71f-7f05-4c11-b16c-1355f0db46a5.png",
          caption: "Executive Conference Room",
          type: "conference"
        },
        {
          url: "/lovable-uploads/5aeb5c53-aa36-4228-8fe5-e1f8f39e617d.png",
          caption: "Student Lounge Area",
          type: "lounge"
        }
      ]
    },
    {
      title: "Registered Office (Chennai)",
      address: "9, Sumathi Square & Madan Square, Neelamangalam, Guduvancheri, Chennai, Tamil Nadu 603202",
      images: [
        {
          url: "/lovable-uploads/929c0469-b0e9-4687-bb79-54bdde89bd3d.png",
          caption: "Office Entrance with SIVAN InfoTech Branding",
          type: "entrance"
        },
        {
          url: "/lovable-uploads/d8a0ba94-804b-43b9-8d41-1962ad27ecba.png",
          caption: "Executive Office with Certifications Display",
          type: "office"
        },
        {
          url: "/lovable-uploads/0a7abc76-98be-4539-afe0-af53f9ef9f9d.png",
          caption: "Professional Workspace with SIVAN InfoTech Setup",
          type: "workspace"
        }
      ]
    }
  ];

  const facilities = [
    {
      icon: Laptop,
      title: "Modern Lab Setup",
      description: "State-of-the-art computers with cloud access"
    },
    {
      icon: Users,
      title: "Collaborative Spaces",
      description: "Interactive learning environments"
    },
    {
      icon: Coffee,
      title: "Student Lounge",
      description: "Comfortable break areas for networking"
    },
    {
      icon: Building,
      title: "Strategic Locations",
      description: "Easily accessible from all parts of the city"
    }
  ];

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Building className="mr-2 h-4 w-4" />
              Our Infrastructure
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              World-Class <span className="text-primary">Training Facilities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience learning in our modern, well-equipped centers designed to provide the best cloud computing education
            </p>
          </div>

          {/* Facilities Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {facilities.map((facility, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <facility.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{facility.title}</h3>
                  <p className="text-gray-600 text-sm">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Location Galleries */}
          <div className="space-y-16">
            {locations.map((location, locationIndex) => (
              <div key={locationIndex} className="space-y-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{location.title}</h3>
                  <div className="flex items-center justify-center text-gray-600 mb-6">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="max-w-2xl">{location.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {location.images.map((image, imageIndex) => (
                    <Card 
                      key={imageIndex} 
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => openLightbox(image.url)}
                    >
                      <div className="relative">
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                            Click to view larger
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900">{image.caption}</h4>
                        <span className="text-sm text-gray-600 capitalize">{image.type}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 text-white text-center mt-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Visit Our Centers
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Experience our world-class facilities firsthand. Schedule a visit to see where your cloud career journey will begin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-gray-100">
                Schedule Campus Visit
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Get Directions
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-white hover:bg-gray-100"
              onClick={closeLightbox}
            >
              <X className="h-4 w-4" />
            </Button>
            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;