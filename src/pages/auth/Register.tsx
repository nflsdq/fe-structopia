import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, AtSign, Lock, UserPlus } from 'lucide-react';
import GameInput from '../../components/common/GameInput';
import GameButton from '../../components/common/GameButton';
import { useAuth } from '../../contexts/AuthContext';
import useAudio from '../../hooks/useAudio';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student' as 'student',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const { playSound } = useAudio();
  
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'role' ? 'student' : value,
    }));
    
    // Clear errors when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Nama wajib diisi';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      playSound('error');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(formData);
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-neutral-900 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-20">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary-500/30 via-transparent to-transparent transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent-500/30 via-transparent to-transparent transform translate-y-1/2"></div>
      </div>
      
      {/* Register form card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md z-10"
      >
        <div className="game-card p-8">
          {/* Card header */}
          <div className="text-center mb-8">
            <Link 
              to="/"
              className="inline-block mb-6"
              onClick={() => playSound('click')}
            >
              <div className="w-16 h-16 mx-auto bg-primary-500 rounded-xl flex items-center justify-center">
                <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stop-color="#6D28D9"/>
                      <stop offset="100%" stop-color="#4C1D95"/>
                    </radialGradient>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur"/>
                      <feMerge>
                        <feMergeNode in="blur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  <rect width="100" height="100" rx="20" fill="url(#bg)"/               >

                  <circle cx="50" cy="28" r="8" fill="#F97316" filter="url(#glow)"/>
                  <circle cx="30" cy="55" r="6" fill="#ffffff" filter="url(#glow)"/>
                  <circle cx="70" cy="55" r="6" fill="#ffffff" filter="url(#glow)"/>
                  <line x1="50" y1="28" x2="30" y2="55" stroke="#fff" stroke-width="3" stroke-linecap="round" />
                  <line x1="50" y1="28" x2="70" y2="55" stroke="#fff" stroke-width="3" stroke-linecap="round" /               >

                  <rect x="48" y="65" width="4" height="4" fill="#FACC15"/>
                  <rect x="46" y="69" width="8" height="2" fill="#FACC15"/>
                  <rect x="47" y="72" width="6" height="2" fill="#FACC15"/                >

                  <text x="50%" y="92" text-anchor="middle" fill="#fff" font-size="12" font-family="Poppins" font-weight="600">XP</text>
                </svg>
              </div>
            </Link>
            <h1 className="text-3xl font-display font-bold text-white">Daftar Akun Baru</h1>
            <p className="text-neutral-400 mt-2">Mulai petualangan struktur data Anda</p>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit}>
            <GameInput
              label="Nama Lengkap"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap Anda"
              error={errors.name}
              required
              icon={<User size={20} />}
              autoComplete="name"
            />
            
            <GameInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Masukkan email Anda"
              error={errors.email}
              required
              icon={<AtSign size={20} />}
              autoComplete="email"
            />
            
            <GameInput
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Masukkan password Anda"
              error={errors.password}
              required
              icon={<Lock size={20} />}
              autoComplete="new-password"
            />
            
            <input type="hidden" name="role" value="student" />
            
            <div className="mt-4 mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 text-primary-600 border-neutral-600 rounded focus:ring-primary-500"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-sm text-neutral-400">
                  Saya setuju dengan{' '}
                  <Link 
                    to="#" 
                    className="text-primary-400 hover:text-primary-300"
                    onClick={() => playSound('click')}
                  >
                    Syarat dan Ketentuan
                  </Link>{' '}
                  dan{' '}
                  <Link 
                    to="#" 
                    className="text-primary-400 hover:text-primary-300"
                    onClick={() => playSound('click')}
                  >
                    Kebijakan Privasi
                  </Link>
                </label>
              </div>
            </div>
            
            <GameButton
              type="submit"
              fullWidth
              disabled={isSubmitting}
              icon={<UserPlus size={20} />}
            >
              {isSubmitting ? 'Memuat...' : 'Daftar Sekarang'}
            </GameButton>
          </form>
          
          {/* Login link */}
          <div className="mt-8 text-center">
            <p className="text-neutral-400">
              Sudah punya akun?{' '}
              <Link 
                to="/login" 
                className="text-primary-400 hover:text-primary-300 font-medium"
                onClick={() => playSound('click')}
              >
                Masuk
              </Link>
            </p>
          </div>
        </div>
        
        {/* Back link */}
        <div className="mt-6 text-center">
          <Link 
            to="/" 
            className="text-neutral-400 hover:text-primary-400 text-sm"
            onClick={() => playSound('click')}
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;