
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Migrating a Legacy Retail System to AWS – A Real Internship Project",
      excerpt: "Learn how a team of interns helped migrate a monolithic on-prem retail inventory system to a modern AWS-based microservice architecture.",
      author: "Sivan Info Tech Team",
      date: "2025-01-07",
      category: "Case Study",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "How Our Interns Used AWS Lambda to Automate Report Generation",
      excerpt: "Discover how interns automated a client's weekly sales reports using serverless AWS Lambda, S3, and CloudWatch.",
      author: "Intern Spotlight Series",
      date: "2025-01-04",
      category: "Use Case",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Real Cloud Cost Optimization for a Healthcare Startup Using Azure Advisor",
      excerpt: "A breakdown of how our consulting team reduced monthly Azure spend by 35% using right-sizing, reserved instances, and policy enforcement.",
      author: "Narasimhan Gunasekaran",
      date: "2025-06-27",
      category: "FinOps",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Top 5 Questions Our Students Ask About DevOps Careers",
      excerpt: "Answers to frequently asked questions by bootcamp students on breaking into cloud and DevOps roles.",
      author: "Simma from Sivan Info Tech LLP",
      date: "2025-01-05",
      category: "Career Advice",
      readTime: "8 min read",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Using AWS IAM Best Practices – Mistakes We See in 90% of Accounts",
      excerpt: "Learn from real-world cloud audits where teams misconfigured IAM, and how we resolved it through workshops and training.",
      author: "Sivan Info Tech Security Team",
      date: "2025-06-29",
      category: "Cloud Security",
      readTime: "9 min read",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=250&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              💡 Cloud Insights from <span className="text-blue-600">Real Projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get inspired with practical cloud implementation stories, tips from real-world projects, and expert commentary tailored for aspiring cloud professionals and enterprises.
            </p>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer">
                <div className="relative">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600 hover:bg-blue-700">
                    {post.category}
                  </Badge>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-gray-900 line-clamp-2 hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">{post.readTime}</span>
                    <button className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                      Read More <ArrowRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              View All Articles
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blog;
