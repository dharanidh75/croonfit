import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useStore } from '../store'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { auth, googleProvider } from '../lib/firebase'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

// Friendly error messages for Firebase auth codes
function getAuthErrorMessage(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'No account found with these details. Please check your email & password, or Sign Up first.'
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try logging in instead.'
    case 'auth/weak-password':
      return 'Password is too weak. Please use at least 6 characters.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.'
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.'
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.'
    default:
      return 'Something went wrong. Please try again.'
  }
}

// Syncs the Firebase user to our Supabase backend after any login
async function syncUserToBackend(firebaseUser) {
  const token = await firebaseUser.getIdToken()
  const nameParts = (firebaseUser.displayName || '').split(' ')
  const res = await api.post('/auth/sync', {
    first_name: nameParts[0] || null,
    last_name: nameParts.slice(1).join(' ') || null,
    avatar_url: firebaseUser.photoURL || null,
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return { token, syncedUser: res.data }
}

export function Login() {
  const [tab, setTab]               = useState('login')   // 'login' | 'signup'
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [showPw, setShowPw]         = useState(false)
  const [loading, setLoading]       = useState(false)

  const navigate = useNavigate()
  const { login } = useStore()

  // Removed getRedirectResult useEffect as we will use signInWithPopup now

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!auth) {
      toast.error("Firebase is not configured. Add keys to .env.development and restart.")
      return
    }
    setLoading(true)
    try {
      if (tab === 'login') {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const { token, syncedUser } = await syncUserToBackend(userCredential.user)
        login(
          { email: syncedUser.email, name: `${syncedUser.first_name || ''} ${syncedUser.last_name || ''}`.trim() || 'Guest', ...syncedUser },
          token
        )
        toast.success('Welcome back!')
        navigate('/')
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        await syncUserToBackend(userCredential.user)
        toast.success('Account created! Please log in.')
        setTab('login')
      }
    } catch (err) {
      toast.error(getAuthErrorMessage(err.code))
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast.error("Firebase is not configured. Add keys to .env.development and restart.")
      return
    }
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, googleProvider)
      if (result && result.user) {
        const firebaseUser = result.user
        const token = await firebaseUser.getIdToken()
        try {
          const { syncedUser } = await syncUserToBackend(firebaseUser)
          login(
            { email: syncedUser.email, name: `${syncedUser.first_name || ''} ${syncedUser.last_name || ''}`.trim() || firebaseUser.displayName || 'Guest', ...syncedUser },
            token
          )
        } catch (syncErr) {
          console.warn('Backend sync failed, logging in from Firebase data:', syncErr)
          login(
            { email: firebaseUser.email, name: firebaseUser.displayName || 'Guest', avatar_url: firebaseUser.photoURL },
            token
          )
        }
        toast.success('Welcome!')
        navigate('/')
      }
    } catch (err) {
      if (err.code && err.code !== 'auth/popup-closed-by-user') {
        toast.error(getAuthErrorMessage(err.code))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main: split screen */}
      <div className="flex flex-1 flex-col md:flex-row min-h-screen">

        {/* ── LEFT PANEL — brand image ────────────────────────────────────── */}
        <div className="relative w-full h-[40vh] md:h-auto md:w-1/2 overflow-hidden bg-[#E5E5E5] flex-shrink-0">
          <img
            src="/logo.png"
            alt="Croon Apparel Studio"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* ── RIGHT PANEL — form ─────────────────────────────────────────── */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6 py-12 md:py-16 bg-white">
          <div className="w-full max-w-[400px]">

            {/* Tab toggle */}
            <div className="flex gap-0 border-b border-[#CCCCCC] mb-8">
              {['login', 'signup'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 pb-3 font-heading font-bold text-sm uppercase tracking-wider transition-all duration-150 ${
                    tab === t
                      ? 'text-[#0A0A0A] border-b-2 border-[#0A0A0A] -mb-px'
                      : 'text-[#888888] border-b-2 border-transparent hover:text-[#0A0A0A]'
                  }`}
                >
                  {t === 'login' ? 'Login' : 'Sign Up'}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name fields for signup */}
              {tab === 'signup' && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="block font-body text-xs font-bold uppercase tracking-wider text-[#444444] mb-1.5">First Name</label>
                    <input
                      type="text" required value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      pattern="^[a-zA-Z\s]+$" title="Only letters and spaces are allowed"
                      className="w-full h-10 px-3 border border-[#CCCCCC] focus:border-[#0A0A0A] outline-none font-body text-sm transition-colors duration-150"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block font-body text-xs font-bold uppercase tracking-wider text-[#444444] mb-1.5">Last Name</label>
                    <input
                      type="text" required value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      pattern="^[a-zA-Z\s]+$" title="Only letters and spaces are allowed"
                      className="w-full h-10 px-3 border border-[#CCCCCC] focus:border-[#0A0A0A] outline-none font-body text-sm transition-colors duration-150"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block font-body text-xs font-bold uppercase tracking-wider text-[#444444] mb-1.5">Email</label>
                <input
                  type="email" required value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3 border border-[#CCCCCC] focus:border-[#0A0A0A] outline-none font-body text-sm placeholder:text-[#888888] transition-colors duration-150"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="font-body text-xs font-bold uppercase tracking-wider text-[#444444]">Password</label>
                  {tab === 'login' && (
                    <a href="#" className="font-body text-xs text-[#888888] hover:text-[#0A0A0A] transition-colors duration-150">
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} required value={password}
                    onChange={e => setPassword(e.target.value)}
                    pattern={tab === 'signup' ? "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$" : undefined}
                    title={tab === 'signup' ? "Password must be at least 8 characters long and include a letter, a number, and a special character." : undefined}
                    placeholder="••••••••"
                    className="w-full h-10 px-3 pr-10 border border-[#CCCCCC] focus:border-[#0A0A0A] outline-none font-body text-sm placeholder:text-[#888888] transition-colors duration-150"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#0A0A0A] transition-colors duration-150"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-[#000000] text-white font-heading font-bold text-sm uppercase tracking-wider hover:bg-[#222222] transition-colors duration-150 disabled:opacity-50 mt-2"
              >
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-[#CCCCCC]" />
              <span className="font-body text-xs text-[#888888]">or</span>
              <div className="flex-1 h-px bg-[#CCCCCC]" />
            </div>

            {/* Social logins */}
            <div className="space-y-3">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-11 border border-[#CCCCCC] hover:border-[#0A0A0A] flex items-center justify-center gap-3 font-body text-sm font-bold transition-colors duration-150"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.615 24 12.255 24z"/><path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/><path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.64 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
                Continue with Google
              </button>
            </div>

            {/* Switch tab */}
            <p className="mt-6 text-center font-body text-xs text-[#888888]">
              {tab === 'login' ? (
                <>Don't have an account?{' '}
                  <button onClick={() => setTab('signup')} className="text-[#0A0A0A] font-bold hover:underline">Sign Up</button>
                </>
              ) : (
                <>Already have an account?{' '}
                  <button onClick={() => setTab('login')} className="text-[#0A0A0A] font-bold hover:underline">Login</button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Full-width black footer bar */}
      <div className="bg-[#000000] py-4 px-6 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="font-body text-xs text-[#888888]">© {new Date().getFullYear()} Croonfit. All rights reserved.</p>
        <div className="flex gap-5 font-body text-xs text-[#888888]">
          <a href="#" className="hover:text-white transition-colors duration-150">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors duration-150">Terms of Service</a>
        </div>
      </div>
    </div>
  )
}
