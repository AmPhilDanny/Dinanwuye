import React, { useEffect, useRef, useState } from 'react';
import {
  IonPage,
  IonContent,
  IonSpinner,
} from '@ionic/react';
import { 
  EnvelopeSimple, 
  LockKey, 
  Eye, 
  EyeSlash, 
  GoogleLogo, 
  AppleLogo,
  DeviceMobile,
  Copy
} from '@phosphor-icons/react';
import { toast as sonnerToast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authApi, tokenStorage } from '@services/api';
import {
  SignupRequestSchema,
  LoginRequestSchema,
  OtpSendRequestSchema,
  VerifyOtpRequestSchema,
} from '@utils/schemas';
import useAppStore from '@store/useAppStore';

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const DEMO_ACCOUNTS = [
  { label: 'Male 1', email: 'chidi@example.com', pass: 'Password123!', gender: '👨' },
  { label: 'Male 2', email: 'emeka@example.com', pass: 'Password123!', gender: '👨' },
  { label: 'Female 1', email: 'amaka@example.com', pass: 'Password123!', gender: '👩' },
  { label: 'Female 2', email: 'ngozi@example.com', pass: 'Password123!', gender: '👩' },
];

const Auth = () => {
  const navigate = useNavigate();
  const setAuthUser = useAppStore((s) => s.setAuthUser);

  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'otp'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  // OTP resend countdown
  const [retryAfter, setRetryAfter] = useState(0);
  const countdownRef = useRef(null);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = (seconds) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setRetryAfter(seconds);
    countdownRef.current = setInterval(() => {
      setRetryAfter((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const finishAuth = (data) => {
    tokenStorage.set(data.accessToken, data.refreshToken);
    setAuthUser(data);
    if (data.isNewUser) {
      navigate('/profile-wizard', { replace: true });
    } else {
      navigate('/discover', { replace: true });
    }
  };

  const extractError = (error) => {
    if (error?.response?.data?.message) {
      const msg = error.response.data.message;
      return Array.isArray(msg) ? msg[0] : msg;
    }
    return error?.message || 'Something went wrong. Please try again.';
  };

  const handleLogin = async () => {
    try {
      LoginRequestSchema.parse({ identifier, password });
    } catch (err) {
      sonnerToast.error(err.errors?.[0]?.message || 'Invalid input');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.login(identifier.trim(), password);
      finishAuth(data);
    } catch (err) {
      sonnerToast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    const trimmed = identifier.trim();
    const payload = isEmail(trimmed)
      ? { email: trimmed, password }
      : { phone: trimmed, password };
    try {
      SignupRequestSchema.parse(payload);
    } catch (err) {
      sonnerToast.error(err.errors?.[0]?.message || 'Invalid input');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.signup(payload);
      if (payload.phone) {
        setMode('otp');
        sonnerToast.success('Verification code sent');
        startCountdown(30);
      } else {
        finishAuth(data);
      }
    } catch (err) {
      sonnerToast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const trimmed = identifier.trim();
    try {
      OtpSendRequestSchema.parse({ identifier: trimmed, purpose: 'signup' });
    } catch (err) {
      sonnerToast.error(err.errors?.[0]?.message || 'Invalid identifier');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.sendOtp(trimmed, 'signup');
      sonnerToast.success(data.message || 'Code resent');
      startCountdown(data.retryAfterSeconds ?? 30);
    } catch (err) {
      sonnerToast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmed = identifier.trim();
    try {
      VerifyOtpRequestSchema.parse({ identifier: trimmed, code: otp, purpose: 'signup' });
    } catch (err) {
      sonnerToast.error(err.errors?.[0]?.message || 'Enter the 6-digit code');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.verifyOtp(trimmed, otp, 'signup');
      finishAuth(data);
    } catch (err) {
      sonnerToast.error(extractError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'login') handleLogin();
    else if (mode === 'signup') handleSignup();
    else handleVerifyOtp();
  };

  const handleSocialLogin = (provider) => {
    sonnerToast.info(`${provider} login coming soon`);
  };

  const switchMode = (next) => {
    setMode(next);
    setPassword('');
    setOtp('');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    sonnerToast.success(`Copied ${label} to clipboard!`);
  };

  const autofillDemo = (account) => {
    setIdentifier(account.email);
    setPassword(account.pass);
    sonnerToast.success(`Filled demo account: ${account.email}`);
  };

  const titles = {
    login: 'Welcome Back',
    signup: 'Create Account',
    otp: 'Verify Your Number',
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center py-10">
          {/* Logo mark */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary to-secondary shadow-xl shadow-primary/30">
              <span className="text-2xl">💑</span>
            </div>
            <h1 className="text-2xl font-black text-foreground">{titles[mode]}</h1>
            <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
              {mode === 'otp'
                ? 'Enter the 6-digit code sent to your phone'
                : mode === 'login'
                ? 'Sign in to continue to Dinanwuye'
                : 'Join thousands finding meaningful connections'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {(mode === 'login' || mode === 'signup') && (
               <div className="space-y-3">
                <div className="relative flex items-center rounded-2xl border border-gray-200 bg-background px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-gray-700">
                  {isEmail(identifier) ? (
                    <EnvelopeSimple size={20} className="text-gray-400" weight="bold" />
                  ) : (
                    <DeviceMobile size={20} className="text-gray-400" weight="bold" />
                  )}
                  <input
                    type="text"
                    inputMode={isEmail(identifier) ? 'email' : 'tel'}
                    placeholder="Email or phone (+234...)"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required
                    autoComplete="username"
                    className="ml-3 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-gray-400"
                  />
                </div>

                <div className="relative flex items-center rounded-2xl border border-gray-200 bg-background px-4 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-gray-700">
                  <LockKey size={20} className="text-gray-400" weight="bold" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className="ml-3 flex-1 bg-transparent text-sm font-medium text-foreground outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeSlash size={20} weight="bold" /> : <Eye size={20} weight="bold" />}
                  </button>
                </div>
              </div>
            )}

            {mode === 'otp' && (
              <div className="space-y-3">
                <div className="relative flex items-center rounded-2xl border border-gray-200 bg-background px-4 py-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-gray-700">
                  <LockKey size={24} className="text-gray-400" weight="bold" />
                  <input
                    type="text"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    required
                    autoComplete="one-time-code"
                    inputMode="numeric"
                    maxLength={6}
                    className="ml-3 flex-1 bg-transparent text-center text-2xl font-bold tracking-[0.5rem] text-foreground outline-none placeholder:text-gray-300"
                  />
                </div>
                <div className="text-center text-sm">
                  {retryAfter > 0 ? (
                    <span className="text-gray-500">Resend code in {retryAfter}s</span>
                  ) : (
                    <button
                      type="button"
                      className="font-bold text-primary transition active:scale-95"
                      onClick={handleResendOtp}
                      disabled={loading}
                    >
                      Resend code
                    </button>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary-pressed py-3.5 text-base font-bold text-white shadow-xl shadow-primary/30 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <IonSpinner name="crescent" color="light" />
              ) : mode === 'otp' ? (
                'Verify'
              ) : mode === 'login' ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {mode === 'login' && (
            <div className="mt-8 rounded-2xl border border-gray-200 bg-background p-4 shadow-sm dark:border-gray-700">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Demo Accounts</span>
                <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="grid grid-cols-1 gap-2">
                {DEMO_ACCOUNTS.map((acc, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50/50 p-2 dark:border-gray-800 dark:bg-gray-800/30">
                    <button 
                      onClick={() => autofillDemo(acc)}
                      className="flex flex-1 items-center gap-2 text-left hover:opacity-80"
                    >
                      <span className="text-lg">{acc.gender}</span>
                      <div className="flex flex-col leading-tight">
                        <span className="text-[10px] font-bold text-gray-500">{acc.label}</span>
                        <span className="text-xs font-semibold text-foreground">{acc.email}</span>
                      </div>
                    </button>
                    <button 
                      onClick={() => copyToClipboard(acc.email, 'email')}
                      className="grid h-8 w-8 place-items-center rounded-full text-primary hover:bg-primary/10 active:scale-90"
                      title="Copy Email"
                    >
                      <Copy size={16} weight="bold" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
            <span className="text-xs font-semibold text-gray-400">or continue with</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-background py-3 text-sm font-bold text-foreground transition active:scale-95 dark:border-gray-700"
            >
              <GoogleLogo size={20} weight="bold" /> Google
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-background py-3 text-sm font-bold text-foreground transition active:scale-95 dark:border-gray-700"
            >
              <AppleLogo size={20} weight="fill" /> Apple
            </button>
          </div>

          <p className="mt-8 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button type="button" className="font-bold text-primary hover:underline" onClick={() => switchMode('signup')}>
                  Sign Up
                </button>
              </>
            ) : mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <button type="button" className="font-bold text-primary hover:underline" onClick={() => switchMode('login')}>
                  Sign In
                </button>
              </>
            ) : (
              <button type="button" className="font-bold text-primary hover:underline" onClick={() => switchMode('login')}>
                Use a different account
              </button>
            )}
          </p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Auth;
