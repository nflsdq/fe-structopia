import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Timer, CheckCircle } from 'lucide-react';
import testService from '../../services/testService';
import useAudio from '../../hooks/useAudio';
import GameButton from '../../components/common/GameButton';
import { TestQuestion } from '../../types';

const TestPage: React.FC = () => {
  const { type } = useParams<{ type: 'pretest' | 'posttest' }>();
  const navigate = useNavigate();
  const { playSound } = useAudio();

  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStartedAt, setTestStartedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!type) return;
      setIsLoading(true);
      try {
        const data = await testService.getQuestions(type);
        setQuestions(data);
        setTestStartedAt(new Date().toISOString());
      } catch (e) {
        navigate('/levels');
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [type, navigate]);

  useEffect(() => {
    if (isLoading || currentIndex >= questions.length) return;
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
  }, [currentIndex, isLoading, questions.length]);

  const handleAnswer = (key: string) => {
    if (!questions[currentIndex]) return;
    playSound('click');
    setAnswers((prev) => ({ ...prev, [questions[currentIndex].id]: key }));
  };

  const handleSubmitTest = useCallback(async () => {
    if (!type || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const startedAt = testStartedAt || new Date().toISOString();
      const result = await testService.submitTest({ type, answers, started_at: startedAt });
      playSound('success');
      navigate(`/test/result/${type}`, { state: { result } });
    } catch (e) {
      playSound('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [type, answers, isSubmitting, navigate, playSound, testStartedAt]);

  function handleNextQuestion() {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setTimeLeft(60);
      playSound('click');
    } else {
      handleSubmitTest();
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-400">Memuat test...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-display font-bold text-white mb-2">Test tidak tersedia</h1>
        <p className="text-neutral-400 mb-6">Belum ada soal untuk test ini.</p>
        <GameButton onClick={() => navigate('/levels')}>Kembali ke Level</GameButton>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const choiceEntries = Array.isArray(currentQuestion.choices)
    ? currentQuestion.choices.map((text, idx) => [String.fromCharCode(65 + idx), text])
    : Object.entries(currentQuestion.choices);

  return (
    <div className="pb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-display font-bold text-white">
            Pertanyaan {currentIndex + 1} dari {questions.length}
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
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="game-card p-8 mb-8"
      >
        <h3 className="text-2xl font-display font-bold text-white mb-6">
          {currentQuestion.question}
        </h3>
        <div className="space-y-4">
          {choiceEntries.map(([key, text], index) => (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              className={`w-full p-4 rounded-lg text-left transition-all ${
                answers[currentQuestion.id] === key
                  ? 'bg-primary-900 border-2 border-primary-500 text-white'
                  : 'bg-neutral-800 border-2 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  answers[currentQuestion.id] === key
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-700 text-neutral-400'
                }`}>
                  {key}
                </div>
                <span>{text}</span>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-end"
      >
        <GameButton
          variant={currentIndex === questions.length - 1 ? 'success' : 'primary'}
          disabled={!answers[currentQuestion.id]}
          onClick={handleNextQuestion}
          icon={currentIndex === questions.length - 1 ? <CheckCircle size={20} /> : undefined}
        >
          {currentIndex === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
        </GameButton>
      </motion.div>
    </div>
  );
};

export default TestPage; 