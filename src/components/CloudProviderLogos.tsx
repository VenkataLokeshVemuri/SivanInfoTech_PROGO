
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CloudProviderLogos = () => {
  const cloudProviders = [
    {
      name: 'Amazon Web Services',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      description: 'AWS Cloud Platform'
    },
    {
      name: 'Microsoft Azure',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
      description: 'Azure Cloud Services'
    },
    {
      name: 'Google Cloud Platform',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
      description: 'GCP Cloud Solutions'
    }
  ];

  const certifications = [
    {
      name: 'AWS Certified Cloud Practitioner',
      logo: 'https://images.credly.com/size/340x340/images/00634f82-b07f-4bbd-a6bb-53de397fc3a6/image.png',
      provider: 'AWS'
    },
    {
      name: 'Azure Fundamentals',
      logo: 'https://images.credly.com/size/340x340/images/be8fcaeb-c769-4858-b567-ffaaa73ce8cf/image.png',
      provider: 'Microsoft'
    },
    {
      name: 'Google Cloud Digital Leader',
      logo: 'https://images.credly.com/size/340x340/images/44994cda-b7b0-44cb-9ab4-bdd5e9f30b75/image.png',
      provider: 'Google Cloud'
    }
  ];

  return (
    <div className="mb-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Cloud Platforms We Cover</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cloudProviders.map((provider, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <img 
                    src={provider.logo} 
                    alt={provider.name}
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{provider.name}</h3>
                <p className="text-sm text-gray-600">{provider.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Industry Certifications Available</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-xl shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow">
                  <img 
                    src={cert.logo} 
                    alt={cert.name}
                    className="w-16 h-16 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 text-sm">{cert.name}</h3>
                <p className="text-xs text-gray-600">{cert.provider}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CloudProviderLogos;
