import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, BookOpen, Award, Users, BarChart } from 'lucide-react';
import GameButton from '../components/common/GameButton';
import { useAuth } from '../contexts/AuthContext';
import useAudio from '../hooks/useAudio';

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { playSound } = useAudio();
  const [currentParallaxY, setCurrentParallaxY] = useState(0);
  
  // Animation references
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [howItWorksRef, howItWorksInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [ctaRef, ctaInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setCurrentParallaxY(scrollY * 0.5);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Features list
  const features = [
    {
      icon: <BookOpen className="w-10 h-10 text-primary-400" />,
      title: 'Materi VAK',
      description: 'Pembelajaran struktur data dengan pendekatan Visual, Auditory, dan Kinesthetic untuk berbagai gaya belajar.'
    },
    {
      icon: <Award className="w-10 h-10 text-accent-400" />,
      title: 'Badge & Rewards',
      description: 'Sistem penghargaan bertingkat untuk memotivasi pengguna melalui pencapaian badge dan level-up.'
    },
    {
      icon: <Users className="w-10 h-10 text-secondary-400" />,
      title: 'Kompetisi Sosial',
      description: 'Fitur leaderboard untuk mendorong persaingan sehat antar pengguna.'
    },
    {
      icon: <BarChart className="w-10 h-10 text-success-400" />,
      title: 'Tracking Progres',
      description: 'Visualisasi kemajuan belajar dengan UI progress yang intuitif dan informatif.'
    }
  ];
  
  // Steps for how it works
  const steps = [
    {
      number: 1,
      title: 'Daftar Akun',
      description: 'Buat akun baru atau masuk dengan akun yang sudah ada.'
    },
    {
      number: 2,
      title: 'Mulai Petualangan',
      description: 'Pilih level sesuai kemampuan dan mulai pelajari struktur data.'
    },
    {
      number: 3,
      title: 'Selesaikan Quest',
      description: 'Pelajari materi dan selesaikan quiz untuk mendapatkan XP dan badge.'
    },
    {
      number: 4,
      title: 'Naik Level',
      description: 'Kumpulkan XP dan buka level selanjutnya dengan materi yang lebih menantang.'
    }
  ];
  
  // Handle button click sound
  const handleButtonClick = () => {
    playSound('buttonClick');
  };
  
  // Scroll to features section
  const scrollToFeatures = () => {
    playSound('click');
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center py-20">
        {/* Background with parallax effect */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundImage: `url('https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1600')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${currentParallaxY}px)`,
            filter: 'brightness(0.3) saturate(1.2)'
          }}
        />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/70 to-neutral-900 z-1"></div>
        
        {/* Content */}
        <div className="container mx-auto px-4 z-10">
          <motion.div
            ref={heroRef}
            initial={{ opacity: 0, y: 50 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-block px-4 py-1 mb-6 rounded-full bg-primary-900 border border-primary-700">
              <span className="text-primary-400 font-medium">Platform Pembelajaran Struktur Data</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-6">
              Petualangan <span className="text-primary-400">Struktur Data</span> Terbaik untuk SMK
            </h1>
            
            <p className="text-xl text-neutral-300 mb-8">
              Pelajari struktur data dengan cara yang menyenangkan melalui pendekatan VAK (Visual, Auditory, Kinesthetic) dalam platform gamifikasi yang dirancang khusus untuk siswa SMK.
            </p>
            
            <div className="flex flex-col items-center sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to={isAuthenticated ? "/dashboard" : "/register"}>
                <GameButton
                  size="lg"
                  onClick={handleButtonClick}
                >
                  {isAuthenticated ? 'Lanjutkan Belajar' : 'Mulai Petualangan'}
                </GameButton>
              </Link>
              
              <GameButton
                variant="secondary"
                size="lg"
                onClick={scrollToFeatures}
              >
                Pelajari Lebih Lanjut
              </GameButton>
            </div>
          </motion.div>
          
          {/* Scroll down indicator */}
          <motion.div 
            className="absolute bottom-10 left-0 right-0 flex justify-center"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <button 
              className="flex flex-col items-center text-neutral-400 hover:text-primary-400"
              onClick={scrollToFeatures}
            >
              <span className="mb-2 text-sm">Scroll ke bawah</span>
              <ChevronDown size={24} />
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 bg-neutral-900 relative overflow-hidden px-0 md:px-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-900/20 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent-900/20 rounded-full translate-x-1/3 translate-y-1/3"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={featuresRef}
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Fitur <span className="text-primary-400">Unggulan</span>
            </h2>
            <p className="text-lg text-neutral-300">
              Structopia menggabungkan pembelajaran struktur data dengan mekanik game yang 
              adiktif untuk menciptakan pengalaman belajar yang menyenangkan.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="game-card p-6 text-center"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-display font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 bg-neutral-800 relative px-0 md:px-12">
        {/* Diagonal background pattern */}
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236D28D9' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            ref={howItWorksRef}
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-4xl font-display font-bold text-white mb-4">
              Cara <span className="text-accent-400">Bermain</span>
            </h2>
            <p className="text-lg text-neutral-300">
              Petualangan struktur data dimulai dengan langkah-langkah sederhana. 
              Berikut adalah cara untuk memulai perjalanan Anda di Structopia.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-primary-600 -translate-y-1/2 z-0"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 flex items-center justify-center rounded-full bg-neutral-700 border-4 border-primary-500 mb-6 relative">
                    <span className="text-2xl font-display font-bold text-white">{step.number}</span>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-primary-500"></div>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-white mb-2 mt-2">{step.title}</h3>
                  <p className="text-neutral-400">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-accent-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-white opacity-10 rounded-full"></div>
        
        <motion.div
          ref={ctaRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 text-center max-w-3xl relative z-10"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Siap Memulai Petualangan Struktur Data?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Bergabunglah dengan ribuan siswa SMK lainnya yang telah merasakan belajar dengan cara baru dan menyenangkan.
          </p>
          
          <div className="flex flex-col items-center sm:flex-row sm:justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to={isAuthenticated ? "/dashboard" : "/register"}>
              <GameButton
                variant="accent"
                size="lg"
                onClick={handleButtonClick}
              >
                {isAuthenticated ? 'Lanjutkan Belajar' : 'Daftar Sekarang'}
              </GameButton>
            </Link>
            
            <Link to={isAuthenticated ? "/profile" : "/login"}>
              <GameButton
                variant="secondary"
                size="lg"
                onClick={handleButtonClick}
              >
                {isAuthenticated ? 'Lihat Profil' : 'Masuk'}
              </GameButton>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;