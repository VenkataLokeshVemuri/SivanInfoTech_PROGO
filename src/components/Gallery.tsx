import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Building, Users, Coffee, Laptop, X } from "lucide-react";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const locations = [
    {
      title: "Bengaluru Branch Office",
      address:
        "BMTC Complex, Outer Ring Rd, Old Madiwala, Kuvempu Nagar, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560068",
      images: [
        {
          url: "/homepage_images/Modern-Workspace-with-Colorful-Workstations.png",
          caption: "Modern Workspace with Colorful Workstations",
          type: "workspace",
        },
        {
          url: "/homepage_images/Corporate-Building-Exterior.png",
          caption: "Corporate Building Exterior",
          type: "building",
        },
        {
          url: "/homepage_images/Meeting-Rooms-with-Red-Glass-Walls.png",
          caption: "Meeting Rooms with Red Glass Walls",
          type: "meeting",
        },
        {
          url: "/homepage_images/Executive-Conference-Room.png",
          caption: "Executive Conference Room",
          type: "conference",
        },
        {
          url: "/homepage_images/Student-Lounge-Area.png",
          caption: "Student Lounge Area",
          type: "lounge",
        },
      ],
    },
    {
      title: "Registered Office (Chennai)",
      address:
        "9, Sumathi Square & Madan Square, Neelamangalam, Guduvancheri, Chennai, Tamil Nadu 603202",
      images: [
        {
          url: "/homepage_images/Office-Entrance-with-SIVAN-InfoTech-Branding.png",
          caption: "Office Entrance with SIVAN InfoTech Branding",
          type: "entrance",
        },
        {
          url: "/homepage_images/Executive-Office-with-Certifications-Display.png",
          caption: "Executive Office with Certifications Display",
          type: "office",
        },
        {
          url: "/homepage_images/Professional-Workspace-with-SIVAN-InfoTech-Setup.png",
          caption: "Professional Workspace with SIVAN InfoTech Setup",
          type: "workspace",
        },
      ],
    },
  ];

  const facilities = [
    {
      icon: Laptop,
      title: "Modern Lab Setup",
      description: "State-of-the-art computers with cloud access",
    },
    {
      icon: Users,
      title: "Collaborative Spaces",
      description: "Interactive learning environments",
    },
    {
      icon: Coffee,
      title: "Student Lounge",
      description: "Comfortable break areas for networking",
    },
    {
      icon: Building,
      title: "Strategic Locations",
      description: "Easily accessible from all parts of the city",
    },
  ];

  return (
    <section
      id="gallery"
      className="py-20 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <Building className="mr-2 h-4 w-4" />
              Our Infrastructure
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              World-Class{" "}
              <span className="text-primary">Training Facilities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience learning in our modern, well-equipped centers designed
              to provide the best cloud computing education
            </p>
          </div>

          {/* Facilities Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {facilities.map((facility, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <facility.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {facility.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Location Galleries */}
          <div className="space-y-16">
            {locations.map((location, locationIndex) => (
              <div key={locationIndex} className="space-y-8">
                <div className="text-center">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {location.title}
                  </h3>
                  <div className="flex items-center justify-center text-gray-600 mb-6">
                    <MapPin className="h-5 w-5 mr-2" />
                    <span className="max-w-2xl">{location.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {location.images.map((image, imageIndex) => (
                    <Card
                      key={imageIndex}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-200"
                      onClick={() => setSelectedImage(image.url)}
                    >
                      <div className="relative h-64 bg-gray-100">
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold text-sm px-4 text-center">
                            Click to view larger
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4 bg-white">
                        <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                          {image.caption}
                        </h4>
                        <span className="text-xs text-blue-600 capitalize bg-blue-50 px-2 py-1 rounded-full">
                          {image.type}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 bg-white hover:bg-gray-100 z-10"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
          <img
            src={selectedImage}
            alt="Gallery Image"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
