"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Cloud, Eye, EyeOff } from 'lucide-react';
import { useBackendAuth } from '@/hooks/useBackendAuth';

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const { login, register } = useBackendAuth();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await login(signInData.email, signInData.password);
      if (result.success) router.push('/dashboard');
    } catch (err) {}
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const result = await register({
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        phone: signUpData.phone
      });
      if (result.success) {
        setSignInData({ email: signUpData.email, password: '' });
        setSignUpData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
      }
    } catch (err) {}
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-6">

      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-transparent bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center py-6">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Cloud className="h-10 w-10 text-green-800" />
            <span className="text-3xl font-extrabold text-gray-900">SitCloud</span>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Welcome</CardTitle>
          <CardDescription className="text-gray-600">Sign in or create your account</CardDescription>
        </CardHeader>

        <CardContent className="py-6">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 rounded-full p-1">
              <TabsTrigger
                value="signin"
                className="rounded-full data-[state=active]:bg-green-900 data-[state=active]:text-white font-medium text-gray-700 hover:text-green-800"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="rounded-full data-[state=active]:bg-green-900 data-[state=active]:text-white font-medium text-gray-700 hover:text-green-800"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-4">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signin-email" className="font-medium text-gray-700">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="border-gray-300 focus:border-green-800 focus:ring focus:ring-green-200"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signin-password" className="font-medium text-gray-700">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={signInData.password}
                      onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                      required
                      className="pr-10 border-gray-300 focus:border-green-800 focus:ring focus:ring-green-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-800 text-white font-semibold hover:bg-green-900 shadow transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="signup-name" className="font-medium text-gray-700">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your full name"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-email" className="font-medium text-gray-700">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-phone" className="font-medium text-gray-700">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    placeholder="Enter your phone number"
                    value={signUpData.phone}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-password" className="font-medium text-gray-700">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="signup-confirm" className="font-medium text-gray-700">Confirm Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-800 text-white font-semibold hover:bg-green-900 shadow transition duration-300"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <Link href="/" className="text-green-800 font-medium hover:text-green-900">
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
