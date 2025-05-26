import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStudentProgress } from '../../services/studentService';
import { useAuth } from '../../contexts/AuthContext';
import { Download, User as UserIcon } from 'lucide-react';

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
  const [testHistory, setTestHistory] = useState<any[]>([]);
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
        setTestHistory(res.data.test_history || []);
      } catch (err: any) {
        setError('Gagal memuat detail siswa');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  const handleExportAllCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    // Progress
    if (progress.length) {
      csvContent += 'Progress Level\n';
      const header = ['Level', 'Status', 'Tanggal Selesai'];
      const rows = progress.map(item => [item.level?.name || '-', item.status, item.completed_at ? new Date(item.completed_at).toLocaleString() : '-']);
      csvContent += [header, ...rows].map(e => e.join(',')).join('\n') + '\n\n';
    }
    // Quiz History
    if (quizHistory.length) {
      csvContent += 'History Kuis\n';
      const header = ['Level', 'Score', 'Lulus', 'Waktu Mulai', 'Waktu Selesai', 'Durasi (detik)'];
      const rows = quizHistory.map(q => [q.level?.name || '-', q.score, q.passed ? 'Ya' : 'Tidak', new Date(q.started_at).toLocaleString(), new Date(q.finished_at).toLocaleString(), q.duration]);
      csvContent += [header, ...rows].map(e => e.join(',')).join('\n') + '\n\n';
    }
    // Test History
    if (testHistory.length) {
      csvContent += 'History Test (Pretest/Posttest)\n';
      const header = ['Tipe', 'Benar', 'Salah', 'Durasi (detik)', 'Tanggal'];
      const rows = testHistory.map(t => [t.type, t.correct_count, t.wrong_count, t.duration, new Date(t.created_at).toLocaleString()]);
      csvContent += [header, ...rows].map(e => e.join(',')).join('\n') + '\n';
    }
    if (csvContent === 'data:text/csv;charset=utf-8,') return;
    let filename = 'detail_siswa.csv';
    if (userDetail && userDetail.name) {
      filename = `detail_siswa_${userDetail.name.replace(/\s+/g, '_').toLowerCase()}.csv`;
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <Link to="/admin/students" className="text-primary-500 hover:underline mb-4 inline-block">&larr; Kembali ke Daftar Siswa</Link>
        <button
          className="flex items-center bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded shadow transition-all mb-2 sm:mb-0"
          onClick={handleExportAllCSV}
          disabled={progress.length === 0 && quizHistory.length === 0 && testHistory.length === 0}
        >
          <Download size={18} className="mr-2" />
          Export Semua Data ke CSV
        </button>
      </div>
      <h1 className="text-2xl font-bold mb-2">Detail Siswa</h1>
      {loading ? (
        <div>Memuat...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : userDetail ? (
        <>
          <div className="mb-6 bg-gradient-to-br from-primary-900/80 to-neutral-900 rounded-xl shadow-lg p-6 flex items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-full bg-primary-800 flex items-center justify-center text-primary-200 shadow">
              <UserIcon size={48} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-primary-100 mb-1 flex items-center gap-2">
                {userDetail.name}
              </div>
              <div className="text-neutral-300 mb-1"><b>Email:</b> <span className="font-mono">{userDetail.email}</span></div>
              <div className="flex flex-wrap gap-4 mt-2">
                <div className="bg-primary-900/60 rounded px-3 py-1 text-primary-200 font-semibold text-sm shadow">XP: {userDetail.xp}</div>
                <div className="bg-accent-900/60 rounded px-3 py-1 text-accent-200 font-semibold text-sm shadow">Level: {userDetail.current_level}</div>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold mt-8 mb-2">Progress Level</h2>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-neutral-900 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-neutral-800 text-primary-300">
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Tanggal Selesai</th>
                </tr>
              </thead>
              <tbody>
                {progress.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-800 hover:bg-primary-900/30 transition-all">
                    <td className="py-2 px-4">{item.level?.name || '-'}</td>
                    <td className="py-2 px-4">{item.status}</td>
                    <td className="py-2 px-4">{item.completed_at ? new Date(item.completed_at).toLocaleString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 mb-2">
            <h2 className="text-xl font-semibold">History Kuis</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-neutral-900 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-neutral-800 text-primary-300">
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Lulus</th>
                  <th className="py-3 px-4">Waktu Mulai</th>
                  <th className="py-3 px-4">Waktu Selesai</th>
                  <th className="py-3 px-4">Durasi (detik)</th>
                </tr>
              </thead>
              <tbody>
                {quizHistory.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-800 hover:bg-primary-900/30 transition-all">
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

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-8 mb-2">
            <h2 className="text-xl font-semibold">History Test (Pretest/Posttest)</h2>
          </div>
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full bg-neutral-900 rounded-lg shadow-lg">
              <thead>
                <tr className="bg-neutral-800 text-primary-300">
                  <th className="py-3 px-4">Tipe</th>
                  <th className="py-3 px-4">Benar</th>
                  <th className="py-3 px-4">Salah</th>
                  <th className="py-3 px-4">Durasi (detik)</th>
                  <th className="py-3 px-4">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {testHistory.map((item) => (
                  <tr key={item.id} className="border-b border-neutral-800 hover:bg-primary-900/30 transition-all">
                    <td className="py-2 px-4">{item.type}</td>
                    <td className="py-2 px-4">{item.correct_count}</td>
                    <td className="py-2 px-4">{item.wrong_count}</td>
                    <td className="py-2 px-4">{item.duration}</td>
                    <td className="py-2 px-4">{new Date(item.created_at).toLocaleString()}</td>
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