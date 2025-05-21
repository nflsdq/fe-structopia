import api from './api';
import { Quiz, QuizAnswer, QuizResult, QuizHistory } from '../types';

const quizService = {
  /**
   * Get quizzes for a specific level
   */
  getLevelQuizzes: async (levelId: number): Promise<Quiz[]> => {
    const response = await api.get<Quiz[]>(`/levels/${levelId}/quiz`);
    return response.data;
  },

  /**
   * Submit quiz answers
   */
  submitQuiz: async (levelId: number, answers: Record<string, string>): Promise<QuizResult> => {
    const response = await api.post<QuizResult>('/quiz/submit', {
      level_id: levelId,
      answers,
    });
    return response.data;
  },
  
  /**
   * Get quiz history
   */
  getQuizHistory: async (): Promise<QuizHistory[]> => {
    const response = await api.get<{ data: QuizHistory[] }>('/quiz/history');
    return response.data.data;
  },
};

export default quizService;