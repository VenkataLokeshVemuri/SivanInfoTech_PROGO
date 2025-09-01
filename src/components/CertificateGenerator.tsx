
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Calendar, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  name: string;
  enrollmentId: string;
  certificateId: string;
  enrollmentDate: string;
}

interface CertificateGeneratorProps {
  student: Student;
}

const CertificateGenerator = ({ student }: CertificateGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const availableCertificates = [
    {
      id: 'aws-fundamentals',
      title: 'AWS Cloud Fundamentals',
      description: 'Completion certificate for AWS basics course',
      status: 'completed',
      completionDate: '2024-01-20',
      provider: 'AWS'
    },
    {
      id: 'azure-basics',
      title: 'Azure Cloud Basics',
      description: 'Microsoft Azure foundation course certificate',
      status: 'in-progress',
      completionDate: null,
      provider: 'Azure'
    },
    {
      id: 'gcp-essentials',
      title: 'GCP Cloud Essentials',
      description: 'Google Cloud Platform fundamentals',
      status: 'locked',
      completionDate: null,
      provider: 'GCP'
    },
    {
      id: 'internship-completion',
      title: 'Cloud Internship Completion',
      description: 'Overall internship completion certificate',
      status: 'available',
      completionDate: '2024-02-15',
      provider: 'SitCloud'
    }
  ];

  const handleGenerateCertificate = async (certificateId: string, title: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate certificate generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Certificate Generated!",
        description: `Your ${title} certificate has been created successfully.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'locked':
        return <Badge className="bg-gray-100 text-gray-800">Locked</Badge>;
      case 'available':
        return <Badge className="bg-purple-100 text-purple-800">Available</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getProviderLogo = (provider: string) => {
    const logos = {
      'AWS': 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      'Azure': 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure.svg',
      'GCP': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
      'SitCloud': '/placeholder.svg'
    };
    return logos[provider as keyof typeof logos] || '/placeholder.svg';
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-yellow-600" />
            <span>Certificate Generator</span>
          </CardTitle>
          <CardDescription>
            Generate and download your course completion certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Certificate Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Student Name:</span>
                <span className="ml-2">{student.name}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Enrollment ID:</span>
                <span className="ml-2">{student.enrollmentId}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Certificate ID:</span>
                <span className="ml-2">{student.certificateId}</span>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Enrollment Date:</span>
                <span className="ml-2">{student.enrollmentDate}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableCertificates.map((cert) => (
          <Card key={cert.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img 
                    src={getProviderLogo(cert.provider)} 
                    alt={cert.provider}
                    className="w-10 h-10 object-contain"
                  />
                  <div>
                    <CardTitle className="text-lg">{cert.title}</CardTitle>
                    <CardDescription>{cert.description}</CardDescription>
                  </div>
                </div>
                {getStatusBadge(cert.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cert.completionDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Completed: {cert.completionDate}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleGenerateCertificate(cert.id, cert.title)}
                    disabled={cert.status === 'locked' || cert.status === 'in-progress' || isGenerating}
                    className="flex-1"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Certificate'}
                  </Button>
                  
                  {(cert.status === 'completed' || cert.status === 'available') && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {cert.status === 'locked' && (
                  <p className="text-xs text-gray-500">
                    Complete previous courses to unlock this certificate
                  </p>
                )}
                
                {cert.status === 'in-progress' && (
                  <p className="text-xs text-gray-500">
                    Complete the course to generate your certificate
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CertificateGenerator;
