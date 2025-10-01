import Image from 'next/image';
import { MapPin, Phone, Clock, Star, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import chennaiEntrance from '@/assets/chennai-entrance.jpg';
import bengaluruBuilding from '@/assets/bengaluru-building.jpg';

const TrainingCenters = () => {
  const centers = [
    {
      name: "Bengaluru Branch Office",
      address: "BMTC Complex, Outer Ring Rd, Old Madiwala, Kuvempu Nagar, BTM 2nd Stage, BTM Layout, Bengaluru, Karnataka 560068",
      phone: "+91 89255 30011",
      specialization: "Cloud Specialization Centre",
      landmarks: ["Near Old Madiwala", "BTM Layout Area", "Outer Ring Road Access"],
      image: bengaluruBuilding
    },
    {
      name: "Registered Office (Chennai)",
      address: "9, Sumathi Square & Madan Square, Neelamangalam, Guduvancheri, Chennai, Tamil Nadu 603202",
      phone: "+91 89255 30011",
      specialization: "Cloud Training HUB",
      landmarks: ["Neelamangalam Area", "Near Guduvancheri", "Chennai Suburban Location"],
      image: chennaiEntrance
    }
  ];

  return (
    <section id="training-centers" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              <MapPin className="mr-2 h-4 w-4" />
              Our Training Centers
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Learning Centers in <span className="text-blue-600">Chennai & Bangalore</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              State-of-the-art facilities with hands-on labs, expert faculty, and comprehensive placement support across multiple locations.
            </p>
          </div>

          {/* Centers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {centers.map((center, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-2xl transition-all duration-300 group border-0 shadow-xl bg-white">
                {/* Center Image */}
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  <Image 
                    src={center.image} 
                    alt={center.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    priority={index === 0}
                    placeholder="blur"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                    <div className="flex items-center text-xs font-semibold text-gray-700">
                      <Star className="h-3 w-3 text-yellow-500 mr-1 fill-current" />
                      Premium
                    </div>
                  </div>
                </div>

                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                    <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                    {center.name}
                  </CardTitle>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    {center.specialization}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Address & Contact */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>{center.address}</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium">{center.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <span>Mon-Sat: 9:00 AM - 8:00 PM</span>
                    </div>
                  </div>

                  {/* Landmarks */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Nearby Landmarks:</h4>
                    <ul className="space-y-1">
                      {center.landmarks.map((landmark, idx) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-center">
                          <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                          {landmark}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-2 pt-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Get Directions
                    </Button>
                    <Button variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                      📞 Call Center
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Can&apos;t Visit Our Centers? No Problem!
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Join our live online classes with the same quality training, hands-on labs, and placement support from anywhere in India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
                  📹 Join Online Classes
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                  📋 View Online Schedule
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrainingCenters;
