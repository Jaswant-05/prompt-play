import { useState, useEffect } from 'react';

export default function Verify() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      verifyEmail(code);
    } else {
      setStatus('error');
      setMessage('No verification code found');
    }
  }, []);

  const verifyEmail = async (code : string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        console.log(data);
        setMessage('Email verified successfully!');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
      } else {
        setStatus('error');
        setMessage('Verification failed');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
          
          {status === 'loading' && (
            <div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p>Verifying your email...</p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-green-600">
              <div className="text-4xl mb-4">✓</div>
              <p>{message}</p>
              <p className="text-sm text-gray-500 mt-2">Redirecting...</p>
            </div>
          )}
          
          {status === 'error' && (
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
          )}
        </div>
      </div>
    </div>
  );
}
