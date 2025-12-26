'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'donatur' | 'penerima'>('donatur');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Handles Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!username || !password) {
        setError('Username dan password harus diisi');
        return;
      }

      // Call API to login
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usernameOrEmail: username,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      // Data dari backend sekarang: 
      // { success: true, message: "...", username, userId, email, role: "DONATUR"/"PENERIMA" }

=======
      const userRole = data.role ? data.role.toLowerCase() : 'donatur';

      // Validate Role
      if (userRole !== selectedRole) {
        throw new Error('Akun tidak sesuai. Silakan login sebagai ' + (userRole === 'donatur' ? 'Donatur' : 'Penerima'));
      }


      const sessionData = {
        username: data.username,
        userId: data.userId,
        role: userRole,
        token: 'mock-jwt-token' // Backend belum provide JWT, placeholder aman
      };

      localStorage.setItem('userSession', JSON.stringify(sessionData));
      console.log('Login success:', sessionData);

      // Redirect ke dashboard yang sesuai berdasarkan role
      const dashboardUrl = sessionData.role === 'admin' ? '/admin/dashboard' : '/dashboard';
      setTimeout(() => {
        router.push(dashboardUrl);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login gagal. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="pt-8 pb-4 text-center border-b border-gray-100">
        <Image
          src="/f6b78b3278cda1016742221dca3c5b8cdbce72c9.png"
          alt="Donasiku Logo"
          width={100}
          height={40}
          priority
          className="mx-auto"
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Masuk</h1>
          <p className="text-gray-600 mb-8">
            Masuk untuk mengakses fitur Aplikasi Donasiku
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Role Selection */}
          <div className="flex p-1 bg-gray-100 rounded-lg mb-8">
            <button
              type="button"
              onClick={() => setSelectedRole('donatur')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === 'donatur'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Donatur
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('penerima')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${selectedRole === 'penerima'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Penerima
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukan username"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-black"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukan password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-full hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          {/* Signup Link */}
          <p className="text-center text-gray-600 mt-6">
            Belum punya akun?{' '}
            <Link
              href="/auth/signup"
              className="text-primary font-semibold hover:underline"
            >
              silahkan daftar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
