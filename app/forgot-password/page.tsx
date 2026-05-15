'use client';

import { sendResetLink } from '@/app/actions/auth';
import Toast from '@/app/components/Toast';
import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { storage } from '../../lib/storage'
import { useLanguage } from '../contexts/LanguageProvider'
import { useTheme } from '../contexts/ThemeProvider'

export default function ForgotPasswordPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme(); // Only need theme, not toggleTheme
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setEmail(value);
    
    if (value === '') {
      setEmailError('');
      setIsEmailValid(false);
    } else if (validateEmailFormat(value)) {
      setEmailError('');
      setIsEmailValid(true);
    } else {
      setEmailError(t('forgot.email.invalid'));
      setIsEmailValid(false);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email) {
      setEmailError(t('forgot.email.required'));
      showToast(t('toast.error.email'), 'error');
      return;
    }
    
    if (!validateEmailFormat(email)) {
      setEmailError(t('forgot.email.invalid'));
      showToast(t('toast.error.invalid'), 'error');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await sendResetLink(email);
      if (result.success) {
        const successMsg = t('toast.success').replace('{email}', email);
        showToast(successMsg, 'success');
        setEmail('');
        setIsEmailValid(false);
      } else {
        showToast(result.message, 'error');
        setEmailError(result.message);
      }
    } catch (error) {
      showToast(t('toast.error.general'), 'error');
      setEmailError(t('toast.error.general'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className={`min-h-screen bg-background flex items-center justify-center p-5 relative transition-colors duration-300 ${
        theme === 'dark' 
          // ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950/50' 
          // : 'bg-gradient-to-br from-slate-50 via-gray-50 to-indigo-50/30'
      }`}>
        
        {/* Decorative background elements with theme awareness */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float ${
            theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-100/30'
          }`} />
          <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float ${
            theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-100/25'
          }`} style={{ animationDelay: '2s', animationDuration: '8s' }} />
          <div className={`absolute top-1/3 right-1/4 w-60 h-60 rounded-full blur-2xl animate-float ${
            theme === 'dark' ? 'bg-blue-500/10' : 'bg-blue-100/20'
          }`} style={{ animationDelay: '1s', animationDuration: '7s' }} />
        </div>

        {/* Main Card */}
        <div className="relative z-10 w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center backdrop-blur-sm rounded-2xl p-2 shadow-sm px-5 ${
              theme === 'dark' ? 'bg-gray-800/70' : 'bg-white/70'
            }`}>
              <i className="fas fa-lock text-indigo-500 text-xl mr-2"></i>
              <span className={`font-semibold tracking-tight ${
                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
              }`}>
                {t('app.title')}
              </span>
            </div>
          </div>

          {/* Forgot Password Card */}
          <div className={`backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border transition-all duration-300 hover:shadow-3xl hover:-translate-y-1 ${
            theme === 'dark' 
              ? 'bg-gray-800/80 border-gray-700' 
              : 'bg-white/80 border-white/40'
          }`}>
            <div className="px-7 pt-8 pb-6 sm:px-8 sm:pt-9">
              {/* Header */}
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-inner ${
                  theme === 'dark' ? 'bg-indigo-900/50' : 'bg-indigo-50'
                }`}>
                  <i className="fas fa-key text-indigo-500 text-2xl"></i>
                </div>
                <h2 className={`text-2xl font-bold tracking-tight ${
                  theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
                }`}>
                  {t('forgot.title')}
                </h2>
                <p className={`text-sm mt-2 max-w-xs ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {t('forgot.subtitle')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="space-y-1">
                  <label htmlFor="email" className={`block text-sm font-medium ml-1 ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {t('forgot.email.label')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className="fas fa-envelope text-gray-400 text-sm"></i>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={handleEmailChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent shadow-sm transition-all ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder:text-gray-400 focus:bg-gray-700' 
                          : 'bg-white/80 border-gray-200 text-gray-800 placeholder:text-gray-400 focus:bg-white'
                      } ${emailError ? 'border-red-400' : isEmailValid ? 'border-emerald-400' : ''}`}
                      placeholder={t('forgot.email.placeholder')}
                      autoComplete="email"
                      disabled={isLoading}
                    />
                  </div>
                  {emailError && (
                    <div className="text-xs text-red-500 mt-1 ml-1 flex items-center gap-1">
                      <i className="fas fa-exclamation-circle text-red-400 text-xs"></i>
                      {emailError}
                    </div>
                  )}
                  {isEmailValid && !emailError && (
                    <div className="text-xs text-emerald-600 mt-1 ml-1 flex items-center gap-1">
                      <i className="fas fa-check-circle text-xs"></i>
                      {t('forgot.email.valid')}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <i className="fas fa-spinner fa-spin text-sm"></i>
                        <span>{t('forgot.button.sending')}</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane text-sm"></i>
                        <span>{t('forgot.button.send')}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Links */}
                <div className="text-center pt-4 space-y-3">
                  <Link
                    href="/login"
                    className={`inline-flex items-center text-sm transition font-medium gap-1 ${
                      theme === 'dark' 
                        ? 'text-indigo-400 hover:text-indigo-300' 
                        : 'text-indigo-600 hover:text-indigo-800'
                    }`}
                  >
                    <i className="fas fa-arrow-left text-xs"></i> {t('forgot.link.back')}
                  </Link>
                  <div className={`text-xs ${
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    {t('forgot.link.signup')}{' '}
                    <Link href="/signup" className="text-indigo-500 hover:underline font-medium">
                      {t('forgot.link.signup')}
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className={`px-7 py-4 border-t text-center text-xs flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'bg-gray-800/50 border-gray-700 text-gray-500' 
                : 'bg-gray-50/70 border-gray-100/80 text-gray-500'
            }`}>
              <i className="fas fa-shield-alt text-indigo-300 text-xs"></i>
              <span>{t('forgot.footer.security')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications with theme support */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
          <div className={`${
            toast.type === 'success' 
              ? theme === 'dark' ? 'bg-emerald-700' : 'bg-emerald-600'
              : toast.type === 'error'
              ? theme === 'dark' ? 'bg-rose-700' : 'bg-rose-600'
              : theme === 'dark' ? 'bg-indigo-700' : 'bg-indigo-600'
          } text-white rounded-xl shadow-2xl px-5 py-3 flex items-center gap-3 backdrop-blur-md`}>
            <i className={
              toast.type === 'success' ? 'fas fa-check-circle' :
              toast.type === 'error' ? 'fas fa-exclamation-triangle' :
              'fas fa-info-circle'
            }></i>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes slide-in-from-bottom-2 {
          from {
            transform: translateY(0.5rem);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slide-in-from-bottom-2 0.3s ease-out;
        }
      `}</style>
    </>
  );
}