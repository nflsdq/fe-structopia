import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentProgress } from '../../services/studentService';
import { useAuth } from '../../contexts/AuthContext';

interface ProgressItem {
  id: number;
  level_id: number;
  status: string;
  completed_at: string | null;
  level: { id: number; name: string; order: number };
}

interface QuizHistoryItem {
  id: number;
  level_id: number;
  score: number;
  passed: boolean;
  started_at: string;
  finished_at: string;
  duration: number;
  level: { id: number; name: string; order: number };
}

interface UserDetail {
  id: number;
  name: string;
  email: string;
  current_level: number;
  xp: number;
}

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!user || user.role !== 'admin') {
    return <div className="text-red-500 p-8">Akses hanya untuk admin.</div>;
  }

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getStudentProgress(id!);
        setUserDetail(res.data.user);
        setProgress(res.data.progress_history.data || []);
        setQuizHistory(res.data.quiz_history.data || []);
      } catch (err: any) {
        setError('Gagal memuat detail siswa');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  return (
    <div className="p-8">
      <Link to="/admin/students" className="text-primary-500 hover:underline mb-4 inline-block">&larr; Kembali ke Daftar Siswa</Link>
      <h1 className="text-2xl font-bold mb-2">Detail Siswa</h1>
      {loading ? (
        <div>Memuat...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : userDetail ? (
        <>
          <div className="mb-6">
            <div><b>Nama:</b> {userDetail.name}</div>
            <div><b>Email:</b> {userDetail.email}</div>
            <div><b>XP:</b> {userDetail.xp}</div>
            <div><b>Level Saat Ini:</b> {userDetail.current_level}</div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-2">Progress Level</h2>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-neutral-900 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4">Level</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Tanggal Selesai</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4">{item.level?.name || '-'}</td>
                    <td className="py-2 px-4">{item.status}</td>
                    <td className="py-2 px-4">{item.completed_at ? new Date(item.completed_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-2">History Kuis</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-neutral-900 rounded-lg">
              <thead>
                <tr>
                  <th className="py-2 px-4">Level</th>
                  <th className="py-2 px-4">Score</th>
                  <th className="py-2 px-4">Lulus</th>
                  <th className="py-2 px-4">Waktu Mulai</th>
                  <th className="py-2 px-4">Waktu Selesai</th>
                  <th className="py-2 px-4">Durasi (detik)</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 px-4">{item.level?.name || '-'}</td>
                    <td className="py-2 px-4">{item.score}</td>
                    <td className="py-2 px-4">{item.passed ? 'Ya' : 'Tidak'}</td>
                    <td className="py-2 px-4">{new Date(item.started_at).toLocaleString()}</td>
                    <td className="py-2 px-4">{new Date(item.finished_at).toLocaleString()}</td>
                    <td className="py-2 px-4">{item.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default StudentDetail; 