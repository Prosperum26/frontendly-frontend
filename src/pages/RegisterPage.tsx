
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../features/auth/services/auth.service';
import NetworkErrorCard from '../components/NetworkErrorCard';
import { GoogleButton } from '../features/auth/components/GoogleButton';
import Header from '../components/Header/Header';
import { EntranceTestChoiceModal } from '../components/EntranceTestChoiceModal/EntranceTestChoiceModal';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordBlurred, setIsPasswordBlurred] = useState(false);
  const [isEmailBlurred, setIsEmailBlurred] = useState(false);
  const [isConfirmPasswordBlurred, setIsConfirmPasswordBlurred] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [backendError, setBackendError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isProgressComplete, setIsProgressComplete] = useState(false);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isVerified) {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 4;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setIsProgressComplete(true);
          setTimeout(() => {
            setShowChoiceModal(true);
          }, 1500);
        }
        setProgress(currentProgress);
      }, 40);
      return () => clearInterval(interval);
    }
  }, [isVerified]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isLengthValid = password.length >= 8 && password.length <= 32;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const isPasswordValid = isLengthValid && hasUppercase && hasLowercase && hasNumber;

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !isEmailValid || !isPasswordValid || password !== confirmPassword || !agreeTerms) {
      return;
    }
    setShowCaptcha(true);
  };

  const handleVerifyAndSave = async () => {
    setIsLoading(true);
    setBackendError(false);
    setErrorMessage('');
    try {
      await authService.register({ name, email, password });
      setIsVerified(true);
    } catch (error: unknown) {
      console.error(error);
      const err = error as { response?: { data?: { message?: string | string[] } } };
      const msg = err.response?.data?.message || 'An error occurred during the verification of your technical information.';
      setErrorMessage(Array.isArray(msg) ? msg.join(', ') : msg);
      setBackendError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-main-bg font-sans relative">
      <EntranceTestChoiceModal isOpen={showChoiceModal} onClose={() => setShowChoiceModal(false)} />
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center p-6 my-8">
        {isOffline ? (
          <NetworkErrorCard
            onRetry={() => window.location.reload()}
            onBack={() => navigate('/')}
          />
        ) : !showCaptcha ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-blue-600 tracking-tight">FrontEndly</h2>
              <p className="text-sm text-muted font-medium mt-2">Technical Excellence Through Precision</p>
            </div>

            <div className="relative w-full max-w-2xl flex flex-col md:flex-row items-start gap-6 justify-center">
              <div className="w-full max-w-xl bg-main-bg rounded-2xl shadow-xl border border-border p-8 md:p-10">
                <div className="text-center mb-8">
                  <p className="text-sm text-body font-medium mb-4">
                    Already have an account? <Link to="/login" className="!text-blue-600 font-bold hover:underline">Log in</Link>
                  </p>
                  <h1 className="text-2xl md:text-3xl font-bold !text-heading text-center">Create Account</h1>
                  <p className="text-sm text-muted mt-2 text-center">Enter your details to join the community.</p>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-body">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2.5 border border-border rounded-lg text-sm bg-surface/50 focus:outline-none focus:border-blue-500 focus:bg-main-bg"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-body">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setIsEmailBlurred(true)}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm bg-surface/50 focus:outline-none focus:border-blue-500 focus:bg-main-bg ${email && !isEmailValid ? 'border-red-400 text-red-500 bg-red-50/20' : 'border-border'}`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-body">Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onBlur={() => setIsPasswordBlurred(true)}
                          placeholder="••••••••"
                          className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm bg-surface/50 focus:outline-none focus:border-blue-500 focus:bg-main-bg ${password && !isPasswordValid ? 'border-red-400 text-red-500 bg-red-50/20' : 'border-border'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-body"
                        >
                          {showPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-body">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          onBlur={() => setIsConfirmPasswordBlurred(true)}
                          placeholder="••••••••"
                          className={`w-full pl-4 pr-10 py-2.5 border rounded-lg text-sm bg-surface/50 focus:outline-none focus:border-blue-500 focus:bg-main-bg ${confirmPassword && password !== confirmPassword ? 'border-red-400 text-red-500 bg-red-50/20' : 'border-border'}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted hover:text-body"
                        >
                          {showConfirmPassword ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start pt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      required
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="terms" className="ml-2 block text-xs text-muted leading-normal font-medium">
                      I agree to the <a href="#" className="text-blue-600 font-bold hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 font-bold hover:underline">Privacy Policy</a> of FrontEndly.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!name || !isEmailValid || !isPasswordValid || password !== confirmPassword || !agreeTerms}
                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors mt-4 flex items-center justify-center gap-1 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20"
                  >
                    Create Account <span className="text-base">→</span>
                  </button>
                </form>

                <div className="mt-8 flex items-center justify-between">
                  <hr className="w-full border-border" />
                  <span className="px-3 text-[10px] text-muted font-bold uppercase tracking-widest whitespace-nowrap">Or register with</span>
                  <hr className="w-full border-border" />
                </div>

                <div className="mt-6 flex justify-center">
                  <GoogleButton />
                </div>
              </div>

              {/* Password Requirements Popup */}
              {isPasswordBlurred && password && !isPasswordValid && (
                <div className="fixed top-20 right-4 z-50 bg-main-bg border border-border rounded-lg p-4 shadow-lg max-w-xs dark:bg-surface dark:border-border">
                  <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-heading dark:text-heading">Password Requirements:</h3>
                  <ul className="space-y-2 text-xs">
                    <li className={`flex items-center gap-2 ${isLengthValid ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      <span className="text-sm">{isLengthValid ? '✓' : '✗'}</span> 8 to 32 characters
                    </li>
                    <li className={`flex items-center gap-2 ${hasUppercase ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      <span className="text-sm">{hasUppercase ? '✓' : '✗'}</span> At least one uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${hasLowercase ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      <span className="text-sm">{hasLowercase ? '✓' : '✗'}</span> At least one lowercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${hasNumber ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                      <span className="text-sm">{hasNumber ? '✓' : '✗'}</span> At least one number
                    </li>
                  </ul>
                </div>
              )}

              {/* Email Validation Popup */}
              {isEmailBlurred && email && !isEmailValid && (
                <div className="fixed top-20 right-4 z-50 bg-main-bg border border-border rounded-lg p-4 shadow-lg max-w-xs dark:bg-surface dark:border-border">
                  <p className="text-xs text-red-500 dark:text-red-400">Invalid email format</p>
                </div>
              )}

              {/* Confirm Password Mismatch Popup */}
              {isConfirmPasswordBlurred && confirmPassword && password !== confirmPassword && (
                <div className="fixed top-20 right-4 z-50 bg-main-bg border border-border rounded-lg p-4 shadow-lg max-w-xs dark:bg-surface dark:border-border">
                  <p className="text-xs text-red-500 dark:text-red-400">Passwords do not match</p>
                </div>
              )}
            </div>
          </>
        ) : backendError ? (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-main-bg rounded-xl shadow-lg border border-border p-8 md:p-10 text-center dark:bg-surface dark:border-border">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 mb-6 dark:bg-red-900/30 dark:text-red-400">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold !text-heading mb-3 dark:text-heading">Verification Failed</h2>
              <p className="text-sm text-red-500 mb-8 leading-relaxed font-medium dark:text-red-400">
                {errorMessage || 'Please try again. An error occurred during the verification of your technical information.'}
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleVerifyAndSave}
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                >
                  Try Again
                </button>
                <button
                  onClick={() => setShowCaptcha(false)}
                  className="w-full bg-white border border-slate-300 text-body font-bold py-3.5 rounded-lg hover:bg-surface transition-colors dark:bg-surface dark:border-border dark:text-heading dark:hover:bg-main-bg"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        ) : !isVerified ? (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <h2 className="text-2xl md:text-3xl font-bold !text-heading mb-3 dark:text-heading">Verify you're not a robot 🤖</h2>
            <p className="text-sm text-slate-500 mb-8 text-center px-4 font-medium dark:text-muted">We need to ensure you're a real person to secure your account</p>

            <div className="w-full max-w-md bg-main-bg rounded-xl shadow-lg border border-border p-6 md:p-8 dark:bg-surface dark:border-border">
              <div className="border border-slate-300 bg-surface rounded-lg p-5 flex items-center justify-between mb-8 dark:border-border dark:bg-main-bg">
                <div className="flex items-center gap-4">
                  <input type="checkbox" className="w-6 h-6 border-2 border-slate-300 rounded-md cursor-pointer dark:border-border" />
                  <span className="text-sm font-semibold !text-heading dark:text-heading">I'm not a robot</span>
                </div>
                <div className="flex flex-col items-center">
                  <svg className="w-8 h-8 text-blue-500 dark:text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21.5 12a9.5 9.5 0 10-19 0 9.5 9.5 0 0019 0zM12 4.5A7.5 7.5 0 114.5 12 7.5 7.5 0 0112 4.5m-3.5 6a1 1 0 100 2 1 1 0 000-2m7 0a1 1 0 100 2 1 1 0 000-2m-3.5 3.5a3 3 0 01-2.5-1.5l1.5-1a1.5 1.5 0 002 0l1.5 1a3 3 0 01-2.5 1.5z" />
                  </svg>
                  <span className="text-[9px] text-muted font-bold mt-1 dark:text-muted">reCAPTCHA</span>
                  <div className="text-[8px] text-muted mt-0.5 font-medium dark:text-muted"><a href="#" className="hover:underline">Privacy</a> - <a href="#" className="hover:underline">Terms</a></div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 mb-8 flex items-start gap-4 dark:bg-blue-900/20 dark:border-blue-800">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <div>
                  <h4 className="text-sm font-bold !text-heading dark:text-heading">Why am I seeing this?</h4>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-medium dark:text-muted">We detected unusual activity from your network. Please confirm to continue.</p>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleVerifyAndSave}
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50"
                >
                  {isLoading ? 'Checking...' : 'Continue →'}
                </button>
                <button
                  onClick={() => setShowCaptcha(false)}
                  disabled={isLoading}
                  className="w-full bg-main-bg border border-slate-300 text-body font-bold py-3.5 rounded-lg hover:bg-surface transition-colors disabled:opacity-50 dark:bg-surface dark:border-border dark:text-heading dark:hover:bg-main-bg"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-main-bg rounded-xl shadow-lg border border-border p-8 md:p-10 text-center">
              <div className="mx-auto w-16 h-16 bg-[#fed7aa] rounded-2xl flex items-center justify-center text-[#9a3412] mb-6">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 12L11 14l4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold !text-heading mb-8">Xác minh thành công</h2>

                <div className="w-full h-1.5 bg-surface rounded-full mb-8 overflow-hidden relative">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-600 rounded-full transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                {isProgressComplete && (
                  <div className="animate-in fade-in duration-300">
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md shadow-blue-600/20"
                    >
                      Continue
                    </button>
                    <p className="text-[11px] text-muted mt-3 font-medium">
                      If you are not redirected automatically, please click the button above.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-surface border-t border-border py-12 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between">
          <div className="mb-8 md:mb-0 max-w-sm">
            <h3 className="text-lg font-black !text-heading mb-2">FrontEndly</h3>
            <p className="text-sm font-semibold text-slate-600 mb-4">Keep going, you're doing great!</p>
            <p className="text-xs text-muted leading-relaxed">
              © 2024 FrontEndly. Built for developers by developers.
              <br />
              Empowering the next generation of engineers with precision-crafted curriculum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
