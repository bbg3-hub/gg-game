'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authenticate, setAdminSession } from '@/lib/adminAuth';

export default function AdminPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = authenticate(password);

    if (!result.success) {
      setError('Invalid access credentials');
      setLoading(false);
      return;
    }

    setAdminSession(result.adminId!);
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-black text-cyan-400 font-mono flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold text-yellow-400">PROMETHEUS CONTROL</div>
          <div className="text-sm opacity-70">Authorized personnel only</div>
        </div>

        <form onSubmit={handleSubmit} className="border-2 border-yellow-400 p-8 space-y-6 shadow-[0_0_20px_rgba(255,255,0,0.5)]">
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">ACCESS CODE</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-black border border-yellow-400 px-4 py-3 text-yellow-400 text-center focus:outline-none focus:shadow-[0_0_15px_rgba(255,255,0,0.5)] placeholder-yellow-700"
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center border border-red-500 p-3">
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`border-2 border-yellow-400 px-12 py-4 text-xl font-bold transition-all duration-200 ${
                loading
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-yellow-400 hover:text-black shadow-[0_0_15px_rgba(255,255,0,0.3)] hover:shadow-[0_0_25px_rgba(255,255,0,0.8)]'
              }`}
            >
              {loading ? 'AUTHENTICATING...' : '>> ACCESS <<'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
