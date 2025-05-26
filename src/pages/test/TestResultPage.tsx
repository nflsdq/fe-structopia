import React from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GameButton from '../../components/common/GameButton';

const TestResultPage: React.FC = () => {
  const { type } = useParams<{ type: 'pretest' | 'posttest' }>();
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    navigate('/levels');
    return null;
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="game-card p-8 text-center">
          <h1 className="text-4xl font-display font-bold text-white mb-2">
            {type === 'pretest' ? 'Pretest Selesai' : 'Posttest Selesai'}
          </h1>
          <p className="text-xl text-neutral-300 mb-8">
            Berikut hasil pengerjaanmu:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="game-card p-6">
              <div className="text-4xl font-display font-bold text-white mb-1">
                {result.correct}
              </div>
              <div className="text-sm text-neutral-400">Jawaban Benar</div>
            </div>
            <div className="game-card p-6">
              <div className="text-4xl font-display font-bold text-white mb-1">
                {result.wrong}
              </div>
              <div className="text-sm text-neutral-400">Jawaban Salah</div>
            </div>
            <div className="game-card p-6">
              <div className="text-4xl font-display font-bold text-accent-400 mb-1">
                {result.duration} detik
              </div>
              <div className="text-sm text-neutral-400">Durasi</div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/levels">
              <GameButton variant="primary">Kembali ke Level</GameButton>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TestResultPage; 