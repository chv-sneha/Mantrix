import { useState } from "react";
import { useLearning } from "../lib/stores/useLearning";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface AuthProps {
  onNavigate: (page: string) => void;
}

export default function Auth({ onNavigate }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, signup } = useLearning();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(username, password);
        onNavigate("home");
      } else {
        await signup(username, password, email);
        onNavigate("home");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900/90 border-2 border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-4xl font-['Press_Start_2P'] text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
            SkillQuest
          </CardTitle>
          <CardDescription className="text-lg font-['VT323'] text-cyan-400">
            {isLogin ? "Welcome Back!" : "Start Your Journey"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-white font-['VT323'] text-xl">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-gray-800 border-purple-400 text-white font-['VT323'] text-lg h-12"
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-['VT323'] text-xl">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-purple-400 text-white font-['VT323'] text-lg h-12"
                placeholder="Enter your password"
              />
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white font-['VT323'] text-xl">
                  Email (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-purple-400 text-white font-['VT323'] text-lg h-12"
                  placeholder="Enter your email"
                />
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded font-['VT323'] text-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-['Press_Start_2P'] text-sm py-6 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Sign Up"}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-cyan-400 hover:text-cyan-300 font-['VT323'] text-lg underline"
              >
                {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
