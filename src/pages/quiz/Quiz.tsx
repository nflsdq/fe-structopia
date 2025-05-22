import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, AlertCircle, Timer, CheckCircle } from 'lucide-react';
import { Quiz as QuizType } from '../../types';
import quizService from '../../services/quizService';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const Quiz: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { playSound } = useAudio();
  
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [choiceKeyMaps, setChoiceKeyMaps] = useState<Record<string, string[]>>({});
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!levelId) return;
      
      setIsLoading(true);
      try {
        const quizDataFromApi = await quizService.getLevelQuizzes(parseInt(levelId!));
        
        let processedQuizzes = quizDataFromApi.map(q => {
          let finalChoicesArray: { key: string; text: string }[] = [];
          let choiceKeys: string[] = [];
          const choicesFromApi = q.choices;
          if (typeof choicesFromApi === 'object' && choicesFromApi !== null && !Array.isArray(choicesFromApi)) {
            const sortedKeys = Object.keys(choicesFromApi).sort();
            finalChoicesArray = sortedKeys.map(key => ({ key, text: choicesFromApi[key] }));
          } else if (Array.isArray(choicesFromApi)) {
            finalChoicesArray = (choicesFromApi as string[]).map((text, idx) => ({ key: String.fromCharCode(65 + idx), text }));
          } else {
            finalChoicesArray = [];
          }
          finalChoicesArray = shuffleArray(finalChoicesArray);
          choiceKeys = finalChoicesArray.map(c => c.key);
          return {
            ...q,
            choices: finalChoicesArray.map(c => c.text),
            _choiceKeys: choiceKeys,
          };
        });
        processedQuizzes = shuffleArray(processedQuizzes);
        const keyMap: Record<string, string[]> = {};
        processedQuizzes.forEach(q => {
          keyMap[q.id] = q._choiceKeys;
        });
        setChoiceKeyMaps(keyMap);
        setQuizzes(processedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        navigate('/levels');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchQuizzes();
  }, [levelId, navigate]);
  
  // Timer countdown
  useEffect(() => {
    if (isLoading || currentIndex >= quizzes.length) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [currentIndex, isLoading, quizzes.length, navigate, handleNextQuestion]);
  
  const handleAnswer = (choiceIndex: number) => {
    if (!quizzes[currentIndex]) return;
    
    playSound('click');
    const quizId = quizzes[currentIndex].id;
    const key = choiceKeyMaps[quizId]?.[choiceIndex];
    setAnswers((prev) => ({
      ...prev,
      [quizId]: key,
    }));
  };
  
  const handleSubmitQuiz = React.useCallback(async () => {
    if (!levelId || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const result = await quizService.submitQuiz(parseInt(levelId), answers);
      playSound(result.passed ? 'success' : 'error');
      navigate(`/quiz/result/${levelId}`, { state: { result } });
    } catch (error) {
      console.error('Error submitting quiz:', error);
      playSound('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [levelId, answers, isSubmitting, navigate, playSound]);

  function handleNextQuestion() {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(60);
      playSound('click');
    } else {
      handleSubmitQuiz();
    }
  }
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat quiz...</p>
        </div>
      </div>
    );
  }
  
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertCircle size={48} className="mx-auto mb-4 text-error-500" />
        <h1 className="text-2xl font-display font-bold text-white mb-2">Quiz tidak tersedia</h1>
        <p className="text-neutral-400 mb-6">Belum ada quiz untuk level ini.</p>
        <Link to={`/levels/${levelId}`}>
          <GameButton onClick={() => playSound('click')}>
            Kembali ke Level
          </GameButton>
        </Link>
      </div>
    );
  }
  
  const currentQuiz = quizzes[currentIndex];
  
  return (
    <div className="pb-12">
      {/* Back button */}
      <div className="mb-6">
        <Link 
          to={`/levels/${levelId}`}
          className="inline-flex items-center text-neutral-400 hover:text-primary-400 transition-colors"
          onClick={() => playSound('click')}
        >
          <ArrowLeft size={20} className="mr-2" />
          <span>Kembali ke Level</span>
        </Link>
      </div>
      
      {/* Quiz progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-bold text-white">
            Pertanyaan {currentIndex + 1} dari {quizzes.length}
          </h2>
          <div className="flex items-center text-warning-400">
            <Timer size={20} className="mr-2" />
            <span className="font-display">{timeLeft}s</span>
          </div>
        </div>
        
        <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentIndex + 1) / quizzes.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
      
      {/* Quiz question */}
      <motion.div
        key={currentQuiz.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="game-card p-8 mb-8"
      >
        <h3 className="text-2xl font-display font-bold text-white mb-6">
          {currentQuiz.question}
        </h3>
        
        <div className="space-y-4">
          {currentQuiz.choices.map((optionText, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                answers[currentQuiz.id] === choiceKeyMaps[currentQuiz.id]?.[index]
                  ? 'bg-primary-900 border-2 border-primary-500 text-white'
                  : 'bg-neutral-800 border-2 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  answers[currentQuiz.id] === choiceKeyMaps[currentQuiz.id]?.[index]
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-700 text-neutral-400'
                }`}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{optionText}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end"
      >
        <GameButton
          variant={currentIndex === quizzes.length - 1 ? 'success' : 'primary'}
          disabled={!answers[currentQuiz.id]}
          onClick={handleNextQuestion}
          icon={currentIndex === quizzes.length - 1 ? <CheckCircle size={20} /> : undefined}
        >
          {currentIndex === quizzes.length - 1 ? 'Selesai' : 'Selanjutnya'}
        </GameButton>
      </motion.div>
    </div>
  );
};

export default Quiz;