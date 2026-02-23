import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { Rocket, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      await authService.register(email, password, name);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[440px] mx-auto mt-16 fade-in-up">
      <div className="apple-card p-10 bg-white">
        <div className="text-center mb-10">
          <div className="inline-flex p-3 bg-[#0071E3] rounded-2xl mb-6 shadow-md shadow-apple-blue/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-[28px] font-bold text-apple-black tracking-tight">Create Account</h2>
          <p className="text-apple-gray mt-2 text-[15px]">Start your startup journey today</p>
        </div>

        {error && (
          <div className="bg-apple-red/5 border border-apple-red/10 text-apple-red p-4 rounded-xl mb-8 text-[13px] font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="apple-label">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="apple-input"
              placeholder="Steve Jobs"
            />
          </div>
          <div className="space-y-2">
            <label className="apple-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="apple-input"
              placeholder="name@company.com"
            />
          </div>
          <div className="space-y-2">
            <label className="apple-label">Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="apple-input"
              placeholder="•••••••• (min 8 characters)"
            />
          </div>
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-[16px] font-semibold"
              isLoading={isLoading}
            >
              Get Started
            </Button>
          </div>
        </form>

        <p className="text-center mt-8 text-apple-gray text-[14px]">
          Already have an account?{' '}
          <Link to="/login" className="text-apple-blue font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};