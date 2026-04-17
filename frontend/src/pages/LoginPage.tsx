import React, { useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

// Define the shape of your backend response based on your screenshot
interface LoginResponse {
  access_token: string;
  token_type: string;
  detail?: string; // For error messages
}

interface StatusState {
  loading: boolean;
  message: string;
  type: 'info' | 'success' | 'error' | '';
}

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [status, setStatus] = useState<StatusState>({
    loading: false,
    message: '',
    type: ''
  });
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, message: 'Authenticating...', type: 'info' });

    // Formatting as x-www-form-urlencoded as required by your backend
    const details = new URLSearchParams();
    details.append('username', formData.username);
    details.append('password', formData.password);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: details,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: LoginResponse = await response.json();

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        setStatus({
          loading: false,
          message: 'Login successful! Redirecting...',
          type: 'success'
        });
        // Redirect to blogs page after a short delay
        setTimeout(() => {
          navigate('/blogs');
        }, 1500);
      } else {
        setStatus({
          loading: false,
          message: data.detail || 'Invalid credentials',
          type: 'error'
        });
      }
    } catch (error) {
      setStatus({
        loading: false,
        message: 'Server connection failed',
        type: 'error'
      });
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="username"
              placeholder="name@company.com"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
            />
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-sm font-semibold text-slate-700">Password</label>
          
            </div>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900"
            />
          </div>

          {status.message && (
            <div
              className={`p-3 rounded-lg text-sm font-medium text-center border transition-all ${
                status.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' :
                status.type === 'error' ? 'bg-red-50 text-red-700 border-red-100' :
                'bg-blue-50 text-blue-700 border-blue-100'
              }`}
              role="alert"
              aria-live="polite"
            >
              {status.message}
            </div>
          )}

          <button
            type="submit"
            disabled={status.loading}
            className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
              status.loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/25'
            }`}
          >
            {status.loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <button onClick={()=>navigate('/register')} className="font-semibold text-blue-600 hover:underline">Create account</button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;