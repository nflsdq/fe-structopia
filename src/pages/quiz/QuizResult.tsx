import React, { useEffect, useRef } from 'react';
import { Link, useParams, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Star, ArrowLeft, Home } from 'lucide-react';
import Confetti from 'react-confetti';
import { QuizResult as QuizResultType } from '../../types';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';
import { toast } from 'react-toastify';

const QuizResult: React.FC = () => {
  const { quizId: levelId } = useParams<{ quizId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useAudio();
  
  const result = location.state?.result as QuizResultType;
  const badgeToastShown = useRef(false);
  
  useEffect(() => {
    if (!result) {
      navigate('/levels');
      return;
    }
    
    if (result.passed) {
      playSound('levelUp');
      if (result.xp_gained > 0) {
        toast.success(`Anda mendapatkan ${result.xp_gained} XP!`);
      }
      // Tampilkan toast badge hanya sekali
      if (!badgeToastShown.current && result.new_badges && result.new_badges.length > 0) {
        toast.success(`Badge baru diperoleh: ${result.new_badges.map(b => b.name).join(', ')}`);
        badgeToastShown.current = true;
      }
    } else {
      toast.info('Jangan menyerah! Terus berlatih dan coba lagi.');
    }
  }, [result, navigate, playSound]);
  
  if (!result) {
    return null;
  }
  
  const percentage = Math.round((result.score / result.total_questions) * 100);
  
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      {result.passed && <Confetti numberOfPieces={200} recycle={false} />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="game-card p-8 text-center">
          {/* Result header */}
          <div className="mb-8">
            <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
              result.passed
                ? 'bg-success-900/50 text-success-400'
                : 'bg-error-900/50 text-error-400'
            }`}>
              {result.passed ? (
                <Trophy size={48} />
              ) : (
                <Star size={48} />
              )}
            </div>
            
            <h1 className="text-4xl font-display font-bold text-white mb-2">
              {result.passed ? 'Selamat!' : 'Jangan Menyerah!'}
            </h1>
            <p className="text-xl text-neutral-300">
              {result.passed
                ? 'Anda telah menyelesaikan quiz dengan baik!'
                : 'Terus berlatih dan coba lagi!'}
            </p>
          </div>
          
          {/* Score details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="game-card p-6">
              <div className="text-4xl font-display font-bold text-white mb-1">
                {percentage}
              </div>
              <div className="text-sm text-neutral-400">Skor</div>
            </div>
            
            <div className="game-card p-6">
              <div className="text-4xl font-display font-bold text-white mb-1">
                {result.score}/{result.total_questions}
              </div>
              <div className="text-sm text-neutral-400">Jawaban Benar</div>
            </div>
            
            <div className="game-card p-6">
              <div className="text-4xl font-display font-bold text-accent-400 mb-1">
                +{result.xp_gained}
              </div>
              <div className="text-sm text-neutral-400">XP Diperoleh</div>
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            {result.passed ? (
              <>
                <Link to="/levels">
                  <GameButton
                    variant="primary"
                    icon={<ArrowLeft size={20} />}
                    onClick={() => playSound('click')}
                  >
                    Kembali ke Level
                  </GameButton>
                </Link>
                
                <Link to="/dashboard">
                  <GameButton
                    variant="accent"
                    icon={<Home size={20} />}
                    onClick={() => playSound('click')}
                  >
                    Dashboard
                  </GameButton>
                </Link>
              </>
            ) : (
              <>
                <Link to={`/levels/${levelId}`}>
                  <GameButton
                    variant="primary"
                    onClick={() => playSound('click')}
                  >
                    Pelajari Lagi
                  </GameButton>
                </Link>
                
                <Link to={`/quiz/${levelId}`}>
                  <GameButton
                    variant="accent"
                    onClick={() => playSound('click')}
                  >
                    Coba Lagi
                  </GameButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuizResult;