import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpen, Upload, BarChart3, User, Lock, CheckCircle, Trophy, Clock } from 'lucide-react';

const Evaluation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [selectedQuiz, setSelectedQuiz] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock login - in real app, this would authenticate with backend
    if (loginForm.email && loginForm.password) {
      setIsLoggedIn(true);
    }
  };

  const sampleQuizzes = [
    {
      id: 'aws-basics',
      title: 'AWS Cloud Fundamentals',
      questions: 15,
      duration: '30 mins',
      difficulty: 'Beginner'
    },
    {
      id: 'azure-intro',
      title: 'Azure Services Overview',
      questions: 20,
      duration: '40 mins',
      difficulty: 'Intermediate'
    },
    {
      id: 'gcp-compute',
      title: 'GCP Compute Services',
      questions: 18,
      duration: '35 mins',
      difficulty: 'Advanced'
    }
  ];

  const mockScores = [
    {
      quiz: 'AWS Cloud Fundamentals',
      score: 85,
      maxScore: 100,
      date: '2024-01-15',
      status: 'Completed'
    },
    {
      quiz: 'Azure Services Overview',
      score: 78,
      maxScore: 100,
      date: '2024-01-10',
      status: 'Completed'
    },
    {
      caseStudy: 'Cloud Migration Project',
      score: 'Pending Review',
      submittedDate: '2024-01-18',
      status: 'Under Review'
    }
  ];

  if (!isLoggedIn) {
    return (
      <section id="evaluation" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                <BookOpen className="mr-2 h-4 w-4" />
                Student Evaluation Portal
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Test Your <span className="text-primary">Cloud Knowledge</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Access quizzes, submit case studies, and track your progress through our comprehensive evaluation system
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <Card className="shadow-xl">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Student Login
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email / Student ID</Label>
                      <Input
                        id="email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                        placeholder="Enter your email or student ID"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                      Access Dashboard
                    </Button>
                  </form>
                  <p className="text-sm text-gray-600 text-center mt-4">
                    Don't have access? Contact your instructor for login credentials.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="evaluation" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
              <User className="mr-2 h-4 w-4" />
              Welcome back, Student!
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Your Learning <span className="text-primary">Dashboard</span>
            </h2>
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => setIsLoggedIn(false)}
                className="text-sm"
              >
                Logout
              </Button>
            </div>
          </div>

          <Tabs defaultValue="quiz" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger value="quiz" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Take Quiz
              </TabsTrigger>
              <TabsTrigger value="case-study" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Case Study
              </TabsTrigger>
              <TabsTrigger value="scorecard" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Scorecard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quiz" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sampleQuizzes.map((quiz) => (
                  <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{quiz.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {quiz.questions} questions
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {quiz.duration}
                        </span>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        quiz.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                        quiz.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedQuiz(quiz.id)}
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="case-study" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Case Study</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="case-study-title">Project Title</Label>
                    <Input
                      id="case-study-title"
                      placeholder="Enter your project title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="case-study-description">Project Description</Label>
                    <textarea
                      id="case-study-description"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows={4}
                      placeholder="Describe your project and implementation details..."
                    />
                  </div>
                  <div>
                    <Label>Upload Project Files</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Drag and drop files here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Supported formats: PDF, DOC, ZIP (Max 10MB)
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">
                    Submit Case Study
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scorecard" className="space-y-6">
              <div className="grid gap-6">
                {mockScores.map((score, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {score.quiz || score.caseStudy}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {score.date ? `Completed: ${score.date}` : `Submitted: ${score.submittedDate}`}
                          </p>
                        </div>
                        <div className="text-right">
                          {typeof score.score === 'number' ? (
                            <div className="flex items-center gap-2">
                              <Trophy className="h-5 w-5 text-yellow-500" />
                              <span className="text-2xl font-bold text-primary">
                                {score.score}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-orange-600 font-medium">
                              {score.score}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          score.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          <CheckCircle className="h-3 w-3" />
                          {score.status}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Evaluation;