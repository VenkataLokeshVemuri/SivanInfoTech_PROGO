
import { Award, TrendingUp, Users, Target } from 'lucide-react';

const PlacementPartners = () => {
  const companies = [
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "TCS", logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg" },
    { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
    { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
    { name: "Accenture", logo: "https://upload.wikimedia.org/wikipedia/commons/c/cd/Accenture.svg" },
    { name: "Cognizant", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Cognizant_logo_2022.svg" },
    { name: "IBM", logo: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
    { name: "HCL", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c7/HCLTech_logo.svg" },
    { name: "Tech Mahindra", logo: "https://upload.wikimedia.org/wikipedia/en/b/b1/Tech_Mahindra_New_Logo.svg" },
    { name: "Capgemini", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Capgemini_Logo_2COL_RGB.svg" }
  ];

  const achievements = [
    {
      icon: Users,
      number: "2000+",
      title: "Students Placed",
      description: "Successfully placed in top companies",
      color: "blue"
    },
    {
      icon: TrendingUp,
      number: "98%",
      title: "Placement Rate",
      description: "Industry-leading placement success",
      color: "green"
    },
    {
      icon: Award,
      number: "₹22L",
      title: "Highest Package",
      description: "Maximum salary achieved",
      color: "purple"
    },
    {
      icon: Target,
      number: "₹8.5L",
      title: "Average Package",
      description: "Mean salary across all placements",
      color: "orange"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
              <Award className="mr-2 h-4 w-4" />
              Placement Partners & Achievements
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Gateway to <span className="text-blue-600">Top Tech Companies</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our students are working at leading organizations worldwide. Join our 98% placement success rate with guaranteed job support.
            </p>
          </div>

          {/* Achievement Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <div className={`w-16 h-16 bg-${achievement.color}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <achievement.icon className={`h-8 w-8 text-${achievement.color}-600`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{achievement.title}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
            ))}
          </div>


          {/* Placement Process */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Our 5-Step Placement Process
              </h3>
              <p className="text-blue-100 max-w-2xl mx-auto">
                We don't just train you - we ensure you get placed with our comprehensive placement support program
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                <h4 className="font-semibold mb-2">Skill Assessment</h4>
                <p className="text-sm text-blue-100">Evaluate your technical skills and identify improvement areas</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                <h4 className="font-semibold mb-2">Resume Building</h4>
                <p className="text-sm text-blue-100">Create industry-standard resume highlighting your cloud skills</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                <h4 className="font-semibold mb-2">Interview Prep</h4>
                <p className="text-sm text-blue-100">Mock interviews and technical question preparation</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                <h4 className="font-semibold mb-2">Job Matching</h4>
                <p className="text-sm text-blue-100">Connect with relevant job opportunities at partner companies</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">5</div>
                <h4 className="font-semibold mb-2">Post-Placement</h4>
                <p className="text-sm text-blue-100">6-month post-placement support and career guidance</p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors">
                🎯 Start Your Placement Journey
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlacementPartners;
