import api from './api';
import { TestQuestion, TestHistory } from '../types';

const testService = {
  async getQuestions(type: 'pretest' | 'posttest'): Promise<TestQuestion[]> {
    const res = await api.get(`/test/questions/${type}`);
    return res.data;
  },
  async submitTest(payload: { type: 'pretest' | 'posttest'; answers: Record<number, string>; started_at: string }) {
    const res = await api.post('/test/submit', payload);
    return res.data;
  },
  async getHistory(): Promise<TestHistory[]> {
    const res = await api.get('/test/history');
    return res.data;
  },
};

export default testService; 