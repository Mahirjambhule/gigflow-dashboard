import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setApiError(null);

    try {
      const response = await api.post('/auth/login', data);
      login(response.data);
      navigate('/dashboard');
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Invalid email or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4 transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md">
        
        {/* --- BRAND HEADER --- */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-600 text-white font-bold text-xl shadow-sm">
              G
            </div>
            <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-wide">GigFlow</span>
          </div>
          
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300">Welcome Back</h2>
        </div>

        {apiError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <input 
              {...register('email')}
              type="email" 
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border ${errors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all`}
              placeholder="admin@example.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input 
              {...register('password')}
              type="password" 
              className={`w-full px-4 py-2 bg-slate-50 dark:bg-slate-900/50 border ${errors.password ? 'border-red-500' : 'border-slate-200 dark:border-slate-700'} rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white transition-all`}
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-70 mt-2 shadow-sm"
          >
            {isLoading ? (
              <><Loader2 className="animate-spin mr-2" size={18} /> Signing in...</>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
          Don't have an account? <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Sign Up</Link>
        </p>

      </div>
    </div>
  );
};