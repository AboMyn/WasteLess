import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { toast } from 'sonner';
export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!savedUser) {
      toast.error('No account found. Please register');
      return;
    }

    if (
      savedUser.email !== email.trim().toLowerCase() ||
      savedUser.password !== password
    ) {
      toast.error('Wrong email or password');
      return;
    }

    localStorage.setItem('isAuth', 'true');

    toast.success('Welcome back');

    setTimeout(() => {
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-green-600 text-white p-3 rounded-2xl">
            <Leaf />
          </div>
          <h1 className="text-2xl font-bold">Wasteless</h1>
        </div>

        <h2 className="text-xl font-semibold mb-2">Welcome back</h2>
        <p className="text-gray-500 mb-6">Login to continue saving food</p>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-xl px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-green-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-xl px-4 py-3 mb-5 outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-500 mt-5">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-green-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}