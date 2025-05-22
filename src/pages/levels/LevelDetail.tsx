import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, BookOpen, Headphones, Activity, Video, 
  Medal, FileText, ThumbsUp, AlertCircle, Tv, Book, Download
} from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Level, Material, MaterialType } from '../../types';
import levelService from '../../services/levelService';
import quizService from '../../services/quizService';
import materialService from '../../services/materialService';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';
import { useAuth } from '../../contexts/AuthContext';

const LevelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { levels, loadLevels, loadUserProgress, checkNewBadges } = useGame();
  const navigate = useNavigate();
  const { playSound } = useAudio();
  const { refreshUser } = useAuth();
  
  const [level, setLevel] = useState<Level | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [activeTab, setActiveTab] = useState<MaterialType | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isQuizAccessible, setIsQuizAccessible] = useState(false);
  const [isLoadingQuizAccess, setIsLoadingQuizAccess] = useState(true);
  const [quizAccessMessage, setQuizAccessMessage] = useState<string | null>(null);
  const [completingMaterialId, setCompletingMaterialId] = useState<number | null>(null);
  
  useEffect(() => {
    const fetchLevelData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setIsLoadingQuizAccess(true);
      setQuizAccessMessage(null);
      setIsQuizAccessible(false);

      try {
        if (levels.length === 0) {
          await loadLevels();
        }
        
        const levelData = await levelService.getLevel(parseInt(id));
        setLevel(levelData);
        
        const materialsData = await levelService.getLevelMaterials(parseInt(id));
        setMaterials(materialsData);

      } catch (error) {
        console.error('Error fetching level data:', error);
        navigate('/levels');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLevelData();
  }, [id, loadLevels, navigate]);

  useEffect(() => {
    if (isLoading || !level) {
      return; 
    }

    setIsLoadingQuizAccess(true);
    setQuizAccessMessage(null);
    setIsQuizAccessible(false);

    let materialsRequirementMet = false;
    if (materials.length === 0) {
      materialsRequirementMet = true;
    } else {
      const materialTypesToConsider: MaterialType[] = ['visual', 'auditory', 'kinesthetic'];
      for (const type of materialTypesToConsider) {
        const typeMaterials = materials.filter(m => m.type === type);
        if (typeMaterials.length > 0 && typeMaterials.every(m => m.is_completed)) {
          materialsRequirementMet = true;
          break;
        }
      }
    }

    if (!materialsRequirementMet) {
      setQuizAccessMessage('Selesaikan semua materi dari salah satu tipe (Visual, Auditori, atau Kinestetik) untuk membuka quiz.');
      setIsQuizAccessible(false);
      setIsLoadingQuizAccess(false);
      return;
    }

    const checkQuizApiAvailability = async () => {
      try {
        await quizService.getLevelQuizzes(level.id);
        setIsQuizAccessible(true);
        setQuizAccessMessage(null);
      } catch (error: any) {
        setIsQuizAccessible(false);
        if (error.response && error.response.status === 403 && error.response.data && error.response.data.message) {
          const apiMessage = error.response.data.message as string;
          if (apiMessage.includes('Anda sudah menyelesaikan dan lulus kuis ini')) {
            setQuizAccessMessage('Anda sudah menyelesaikan dan lulus kuis ini.');
          } else if (apiMessage.includes('Anda harus menyelesaikan semua materi')) {
            setQuizAccessMessage('Selesaikan semua materi dari salah satu tipe (Visual, Auditori, atau Kinestetik) untuk membuka quiz.');
          } else {
            setQuizAccessMessage('Kuis tidak dapat diakses saat ini (izin ditolak).');
          }
        } else {
          console.error('Error checking quiz API availability:', error);
          setQuizAccessMessage('Gagal memeriksa status kuis dari server.');
        }
      } finally {
        setIsLoadingQuizAccess(false);
      }
    };

    checkQuizApiAvailability();

  }, [level, materials, isLoading]);

  const handleCompleteMaterial = async (material: Material) => {
    if (!material || material.is_completed || completingMaterialId === material.id) return;
    
    setCompletingMaterialId(material.id);
    try {
      const response = await materialService.completeMaterial(material.id);
      playSound('success');
      
      if (refreshUser) {
        await refreshUser();
      }
      await checkNewBadges();
      
      await loadUserProgress();
      await loadLevels();
      
      // Update local material state
      setMaterials(prevMaterials => 
        prevMaterials.map(m => 
          m.id === material.id ? { ...m, is_completed: true } : m
        )
      );

      if (response.xp_gained > 0) {
        console.log(`Anda mendapatkan ${response.xp_gained} XP!`);
      }
      if (response.new_badges && response.new_badges.length > 0) {
        console.log(`Badge baru diperoleh: ${response.new_badges.map(b => b.name).join(', ')}`);
      }

    } catch (error) {
      console.error('Error completing material:', error);
      playSound('error');
    } finally {
      setCompletingMaterialId(null);
    }
  };
  
  const handleDownloadAndComplete = (material: Material) => {
    // Buka tautan di tab baru
    window.open(material.media_url, '_blank');
    playSound('click');
    
    // Tandai materi sebagai selesai jika belum selesai
    if (!material.is_completed) {
      handleCompleteMaterial(material);
    }
  };
  
  const handleTabChange = (tab: MaterialType | 'all') => {
    setActiveTab(tab);
    playSound('click');
  };
  
  const getFilteredMaterials = () => {
    if (activeTab === 'all') return materials;
    return materials.filter(material => material.type === activeTab);
  };
  
  const getTypeIcon = (type: MaterialType) => {
    switch (type) {
      case 'visual':
        return <Tv size={20} className="text-primary-400" />;
      case 'auditory':
        return <Headphones size={20} className="text-accent-400" />;
      case 'kinesthetic':
        return <Activity size={20} className="text-success-400" />;
      case 'media':
        return <Video size={20} className="text-secondary-400" />;
      default:
        return <Book size={20} className="text-primary-400" />;
    }
  };
  
  const getCompletedCount = () => {
    return materials.filter(material => material.is_completed).length;
  };
  
  const getTotalDurationMinutes = () => {
    return materials.length * 10;
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat data level...</p>
        </div>
      </div>
    );
  }
  
  if (!level) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
        <h1 className="text-2xl font-display font-bold text-white mb-2">Level tidak ditemukan</h1>
        <p className="text-neutral-400 mb-6">Level yang Anda cari tidak tersedia atau masih terkunci.</p>
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
      <div className="mb-6">
        <Link 
          to="/levels"
          className="inline-flex items-center text-neutral-400 hover:text-primary-400 transition-colors"
          onClick={() => playSound('click')}
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Kembali ke Peta Level</span>
        </Link>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="bg-gradient-to-r from-neutral-900 to-primary-900 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full opacity-10 transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent-500 rounded-full opacity-10 transform -translate-x-1/3 translate-y-1/3"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="level-badge mr-4">{level.order}</div>
              <h1 className="text-4xl font-display font-bold text-white">{level.name}</h1>
            </div>
            
            <p className="text-lg text-neutral-300 mb-6">
              {level.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="inline-flex items-center bg-neutral-800/50 px-4 py-2 rounded-lg">
                <BookOpen size={18} className="text-primary-400 mr-2" />
                <span className="text-sm text-neutral-300">
                  {materials.length} Materi
                </span>
              </div>
              
              <div className="inline-flex items-center bg-neutral-800/50 px-4 py-2 rounded-lg">
                <Medal size={18} className="text-accent-400 mr-2" />
                <span className="text-sm text-neutral-300">
                  {getCompletedCount()} / {materials.length} Selesai
                </span>
              </div>
              
              <div className="inline-flex items-center bg-neutral-800/50 px-4 py-2 rounded-lg">
                <FileText size={18} className="text-secondary-400 mr-2" />
                <span className="text-sm text-neutral-300">
                  Estimasi: {getTotalDurationMinutes()} menit
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="mb-8">
        <div className="flex overflow-x-auto pb-2 hide-scrollbar">
          <button
            className={`px-6 py-2 mr-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'all'
                ? 'bg-primary-900 text-primary-300 border border-primary-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            onClick={() => handleTabChange('all')}
          >
            Semua
          </button>
          
          <button
            className={`flex items-center px-6 py-2 mr-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'visual'
                ? 'bg-primary-900 text-primary-300 border border-primary-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            onClick={() => handleTabChange('visual')}
          >
            <Tv size={16} className="mr-2" />
            Visual
          </button>
          
          <button
            className={`flex items-center px-6 py-2 mr-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'auditory'
                ? 'bg-primary-900 text-primary-300 border border-primary-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            onClick={() => handleTabChange('auditory')}
          >
            <Headphones size={16} className="mr-2" />
            Auditory
          </button>
          
          <button
            className={`flex items-center px-6 py-2 mr-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'kinesthetic'
                ? 'bg-primary-900 text-primary-300 border border-primary-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            onClick={() => handleTabChange('kinesthetic')}
          >
            <Activity size={16} className="mr-2" />
            Kinesthetic
          </button>
          
          <button
            className={`flex items-center px-6 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === 'media'
                ? 'bg-primary-900 text-primary-300 border border-primary-700'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            onClick={() => handleTabChange('media')}
          >
            <Video size={16} className="mr-2" />
            Media
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {getFilteredMaterials().map((material, index) => (
          <motion.div
            key={material.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {material.type === 'media' && material.media_url ? (
              <div className="block game-card border-2 border-neutral-700 hover:border-secondary-600 p-6">
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    {getTypeIcon(material.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-white mb-2">{material.title}</h3>
                    <p className="text-neutral-400 line-clamp-2 mb-4">
                      {material.content.substring(0, 120)}...
                    </p>
                    <div className="flex items-center">
                      <span className={'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary-900/50 text-secondary-400 border border-secondary-800'}>
                        Media
                      </span>
                      {material.is_completed && (
                        <span className="inline-flex items-center ml-3 text-xs text-success-400">
                          <ThumbsUp size={14} className="mr-1" />
                          Selesai
                        </span>
                      )}
                    </div>
                    <GameButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handleDownloadAndComplete(material)}
                        className="mt-4"
                        icon={<Download size={16} />}
                        disabled={completingMaterialId === material.id}
                      >
                        {completingMaterialId === material.id ? 'Memproses...' : 'Unduh File'}
                      </GameButton>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      material.is_completed ? 'bg-success-900/20 border border-success-700' : 'bg-neutral-800'
                    }`}>
                      {material.is_completed ? (
                        <ThumbsUp size={16} className="text-success-400" />
                      ) : (
                        <Video size={16} className="text-neutral-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Link 
                to={`/materials/${material.id}`}
                className="block game-card border-2 border-neutral-700 hover:border-primary-600 p-6"
                onClick={() => playSound('click')}
              >
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    {getTypeIcon(material.type)}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-display font-bold text-white mb-2">{material.title}</h3>
                    <p className="text-neutral-400 line-clamp-2 mb-4">
                      {material.content.substring(0, 120)}...
                    </p>
                    
                    <div className="flex items-center">
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
                      
                      {material.is_completed && (
                        <span className="inline-flex items-center ml-3 text-xs text-success-400">
                          <ThumbsUp size={14} className="mr-1" />
                          Selesai
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 ml-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      material.is_completed ? 'bg-success-900/20 border border-success-700' : 'bg-neutral-800'
                    }`}>
                      {material.is_completed ? (
                        <ThumbsUp size={16} className="text-success-400" />
                      ) : (
                        <BookOpen size={16} className="text-neutral-400" />
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )}
          </motion.div>
        ))}
        
        {getFilteredMaterials().length === 0 && (
          <div className="text-center py-12">
            <AlertCircle size={32} className="mx-auto mb-4 text-neutral-500" />
            <p className="text-neutral-400">
              Tidak ada materi {activeTab !== 'all' ? activeTab : ''} yang tersedia saat ini.
            </p>
          </div>
        )}
      </div>
      
      {materials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-10 text-center"
        >
          <div className="flex justify-center">
            <GameButton 
              variant="accent"
              size="lg"
              onClick={() => {
                if (!isLoadingQuizAccess && isQuizAccessible) {
                  playSound('click');
                  navigate(`/quiz/${level!.id}`);
                } else {
                  playSound('error');
                }
              }}
              disabled={isLoadingQuizAccess || !isQuizAccessible}
              className={
                (isLoadingQuizAccess || !isQuizAccessible) 
                  ? 'bg-neutral-700 border-neutral-600 text-neutral-500 hover:bg-neutral-700 cursor-not-allowed' 
                  : ''
              }
            >
              {isLoadingQuizAccess ? 'Memeriksa Akses...' : 'Mulai Quiz'}
            </GameButton>
          </div>
          {!isLoadingQuizAccess && !isQuizAccessible && quizAccessMessage && (
            <p className="mt-4 text-sm text-warning-400">
              {quizAccessMessage}
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default LevelDetail;