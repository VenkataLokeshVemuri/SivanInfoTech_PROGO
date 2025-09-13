import { Target, BookOpen, Briefcase, Trophy, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: "01",
      title: "Choose Your Cloud Path",
      description: "Select from AWS, Azure, or GCP certification tracks based on your career goals",
      icon: Target,
      color: "primary"
    },
    {
      step: "02", 
      title: "Attend Live Sessions",
      description: "Join interactive sessions with industry experts and hands-on practical training",
      icon: BookOpen,
      color: "azure-blue"
    },
    {
      step: "03",
      title: "Work on Real Projects", 
      description: "Build real-world projects and case studies to strengthen your portfolio",
      icon: Briefcase,
      color: "aws-orange"
    },
    {
      step: "04",
      title: "Get Placed with Support",
      description: "Receive comprehensive placement assistance and career guidance",
      icon: Trophy,
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
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-primary via-azure-blue via-aws-orange to-secondary transform -translate-y-1/2 rounded-full"></div>
            
            {/* Steps */}
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div key={index} className="relative">
                    {/* Step Card */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg card-hover border border-primary/10 text-center relative">
                      {/* Step Number */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-${step.color} to-${step.color}/80 text-white font-bold text-xl mb-6 mx-auto`}>
                        {step.step}
                      </div>

                      {/* Icon */}
                      <div className="mb-4 flex justify-center">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r from-${step.color}/10 to-${step.color}/5 flex items-center justify-center`}>
                          <IconComponent className={`h-6 w-6 text-${step.color}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                      {/* Arrow for desktop */}
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                          <ArrowRight className="h-8 w-8 text-primary/30" />
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