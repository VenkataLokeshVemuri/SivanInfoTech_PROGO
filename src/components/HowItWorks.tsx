import { Target, BookOpen, Briefcase, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Cloud Path",
      description: "Select from AWS, Azure, or GCP certification tracks based on your career goals",
      icon: Target,
      iconClass: "text-primary",
      bgColor: "bg-primary/10",
      color: "primary"
    },
    {
      step: "02", 
      title: "Attend Live Sessions",
      description: "Join interactive sessions with industry experts and hands-on practical training",
      icon: BookOpen,
      iconClass: "text-blue-600",
      bgColor: "bg-blue-100",
      color: "azure-blue"
    },
    {
      step: "03",
      title: "Work on Real Projects", 
      description: "Build real-world projects and case studies to strengthen your portfolio",
      icon: Briefcase,
      iconClass: "text-orange-600",
      bgColor: "bg-orange-100",
      color: "aws-orange"
    },
    {
      step: "04",
      title: "Get Placed with Support",
      description: "Receive comprehensive placement assistance and career guidance",
      icon: Trophy,
      iconClass: "text-amber-600",
      bgColor: "bg-amber-100",
      color: "secondary"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-muted/30 to-accent/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gradient-primary mb-6">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our proven 4-step methodology that has helped 200+ students land their dream cloud careers
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-500 to-amber-500 transform -translate-y-1/2 rounded-full"></div>
            
            {/* Steps */}
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 text-center relative">
                      {/* Step Number */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-blue-600' : index === 2 ? 'bg-orange-600' : 'bg-amber-600'} text-white font-bold text-xl mb-6 mx-auto shadow-md`}>
                        {step.step}
                      </div>

                      {/* Icon */}
                      <div className="mb-6 flex justify-center">
                        <div className={`w-16 h-16 rounded-full ${step.bgColor} flex items-center justify-center shadow-sm`}>
                          <IconComponent className={`h-8 w-8 ${step.iconClass}`} strokeWidth={1.5} />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{step.description}</p>

                      {/* Arrow for desktop */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                          <div className="bg-white rounded-full p-1 shadow-md">
                            <ArrowRight className="h-8 w-8 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

         
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;