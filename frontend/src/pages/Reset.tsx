import { useEffect, useState } from "react";

export default function Reset() {
  const [status, setStatus] = useState('form');
  const [message, setMessage] = useState('');
  const [passwords, setPasswords] = useState({ password1: '', password2: '' });
  const [code, setCode] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const resetCode = urlParams.get('code');
    
    if (resetCode) {
      setCode(resetCode);
    } else {
      setStatus('error');
      setMessage('Invalid reset link');
    }
  }, []);

  const handleSubmit = async () => {
    if (passwords.password1 !== passwords.password2) {
      setMessage('Passwords do not match');
      return;
    }

    if (passwords.password1.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    try {
      setStatus('loading');
      
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          password1: passwords.password1,
          password2: passwords.password2
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage('Password reset successfully!');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
      } else {
        setStatus('form');
        setMessage('Reset failed');
      }
    } catch (error) {
      setStatus('form');
      setMessage('Something went wrong');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
          <div className="text-green-600">
            <div className="text-4xl mb-4">✓</div>
            <p>{message}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error' || !code) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow text-center">
          <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
          <div className="text-red-600">
            <div className="text-4xl mb-4">✗</div>
            <p>{message}</p>
            <a 
              href="/signin" 
              className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold">Reset Password</h1>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={passwords.password1}
              onChange={(e) => setPasswords(prev => ({ ...prev, password1: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={passwords.password2}
              onChange={(e) => setPasswords(prev => ({ ...prev, password2: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirm new password"
            />
          </div>

          {message && (
            <div className="text-red-600 text-sm text-center">
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={status === 'loading'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {status === 'loading' ? 'Resetting...' : 'Reset Password'}
          </button>

          <div className="text-center">
            <a href="/signin" className="text-blue-600 hover:text-blue-800 text-sm">
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}