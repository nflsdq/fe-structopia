import api from './api';

export const getAllStudents = () => api.get('/admin/students');
export const getStudentProgress = (id: number | string) => api.get(`/admin/students/${id}/progress`); 