import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Headphones, Activity, Video, ThumbsUp, AlertCircle, Star } from 'lucide-react';
import { Material} from '../../types';
import materialService from '../../services/materialService';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';
import { useAuth } from '../../contexts/AuthContext';
import { useGame } from '../../contexts/GameContext';
import { toast } from 'react-toastify';

const MaterialDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { playSound } = useAudio();
  const { refreshUser } = useAuth();
  const { checkNewBadges, loadUserProgress, loadLevels } = useGame();
  
  const [material, setMaterial] = useState<Material | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  
  useEffect(() => {
    const fetchMaterial = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const materialData = await materialService.getMaterial(parseInt(id));
        setMaterial(materialData);
      } catch (error) {
        console.error('Error fetching material:', error);
        navigate('/levels');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMaterial();
  }, [id]);
  
  const handleComplete = async () => {
    if (!material || isCompleting) return;
    
    setIsCompleting(true);
    try {
      const response = await materialService.completeMaterial(material.id);
      playSound('success');
      
      if (refreshUser) {
        await refreshUser();
      }
      await checkNewBadges();
      
      await loadUserProgress();
      await loadLevels();

      if (response.xp_gained > 0) {
        toast.success(`Anda mendapatkan ${response.xp_gained} XP!`);
      }
      if (response.new_badges && response.new_badges.length > 0) {
        toast.success(`Badge baru diperoleh: ${response.new_badges.map(b => b.name).join(', ')}`);
      }

    } catch (error) {
      console.error('Error completing material:', error);
      playSound('error');
      toast.error('Gagal menyelesaikan materi.');
    } finally {
      setIsCompleting(false);
    }
  };
  
  const getTypeIcon = () => {
    if (!material) return null;
    
    switch (material.type) {
      case 'visual':
        return <BookOpen size={24} className="text-primary-400" />;
      case 'auditory':
        return <Headphones size={24} className="text-accent-400" />;
      case 'kinesthetic':
        return <Activity size={24} className="text-success-400" />;
      case 'media':
        return <Video size={24} className="text-secondary-400" />;
      default:
        return <BookOpen size={24} className="text-primary-400" />;
    }
  };
  
  // Tambahkan fungsi utilitas untuk deteksi dan konversi YouTube
  const getYouTubeEmbedUrl = (url: string): string | null => {
    // Regex untuk mendeteksi dan mengambil ID video YouTube
    const regExp = /^.*(?:youtu.be\/|v=|embed\/|watch\?v=|watch\?.+&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11
      ? `https://www.youtube.com/embed/${match[1]}`
      : null;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat materi...</p>
        </div>
      </div>
    );
  }
  
  if (!material) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
        <h1 className="text-2xl font-display font-bold text-white mb-2">Materi tidak ditemukan</h1>
        <p className="text-neutral-400 mb-6">Materi yang Anda cari tidak tersedia.</p>
        <Link to="/levels">
          <GameButton onClick={() => playSound('click')}>
            Kembali ke Peta Level
          </GameButton>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="pb-12">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to={`/levels/${material.level_id}`}
          className="inline-flex items-center text-neutral-400 hover:text-primary-400 transition-colors"
          onClick={() => playSound('click')}
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Kembali ke Level</span>
        </Link>
      </div>
      
      {/* Material header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="bg-gradient-to-r from-neutral-900 to-primary-900 rounded-2xl p-8 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mr-4">
                {getTypeIcon()}
              </div>
              <h1 className="text-4xl font-display font-bold text-white">{material.title}</h1>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center bg-neutral-800/50 px-4 py-2 rounded-lg">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                  material.type === 'visual' ? 'bg-primary-900/50 text-primary-400 border border-primary-800' :
                  material.type === 'auditory' ? 'bg-accent-900/50 text-accent-400 border border-accent-800' :
                  material.type === 'kinesthetic' ? 'bg-success-900/50 text-success-400 border border-success-800' :
                  'bg-secondary-900/50 text-secondary-400 border border-secondary-800'
                }`}>
                  {material.type === 'visual' ? 'Visual' :
                   material.type === 'auditory' ? 'Auditory' :
                   material.type === 'kinesthetic' ? 'Kinesthetic' : 'Media'}
                </span>
              </div>
              
              {material.is_completed && (
                <div className="inline-flex items-center bg-success-900/50 px-4 py-2 rounded-lg">
                  <ThumbsUp size={18} className="text-success-400 mr-2" />
                  <span className="text-sm text-success-300">Selesai</span>
                </div>
              )}
              {/* XP Value Display */}
              <div className="inline-flex items-center bg-warning-900/50 px-4 py-2 rounded-lg">
                <Star size={18} className="text-warning-400 mr-2" />
                <span className="text-sm text-warning-300">{material.xp_value} XP</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Material content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="game-card p-8 mb-8"
      >
        {/* Media content if available */}
        {material.media_url && (
          <div className="mb-8">
            {material.type === 'visual' && (
              (() => {
                const youtubeEmbed = getYouTubeEmbedUrl(material.media_url);
                if (youtubeEmbed) {
                  return (
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={youtubeEmbed}
                        width="100%"
                        height="400"
                        style={{ border: 'none' }}
                        allowFullScreen
                        title={material.title || 'YouTube Video'}
                      ></iframe>
                    </div>
                  );
                } else {
                  return (
                    <img
                      src={material.media_url}
                      alt={material.title}
                      className="w-full rounded-lg"
                    />
                  );
                }
              })()
            )}
            
            {material.type === 'media' && (
              <video
                src={material.media_url}
                controls
                className="w-full rounded-lg"
              />
            )}
            
            {material.type === 'auditory' && (
              <audio
                src={material.media_url}
                controls
                className="w-full"
              />
            )}

            {material.type === 'kinesthetic' && (
              <div className="game-card aspect-w-16 aspect-h-9">
                <iframe
                  src={material.media_url}
                  width="100%"
                  height="700"
                  style={{ border: 'none' }}
                  allowFullScreen
                  title={material.title || 'Interactive Content'}
                ></iframe>
              </div>
            )}
          </div>
        )}
        
        {/* Text content */}
        <div className="prose prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: material.content }} />
        </div>
      </motion.div>
      
      {/* Complete button */}
      {!material.is_completed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <GameButton
            variant="success"
            size="lg"
            onClick={handleComplete}
            disabled={isCompleting}
            icon={<ThumbsUp size={20} />}
          >
            {isCompleting ? 'Memproses...' : 'Tandai Selesai'}
          </GameButton>
          <p className="mt-2 text-sm text-neutral-400">
            Tandai materi ini sebagai selesai untuk mendapatkan XP
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default MaterialDetail;