import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../services/studentService';
import { useAuth } from '../../contexts/AuthContext';
import { Download } from 'lucide-react';

interface Student {
  id: number;
  name: string;
  email: string;
  xp: number;
  current_level: number;
  created_at: string;
}

const StudentList: React.FC = () => {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') {
    return <div className="text-red-500 p-8">Akses hanya untuk admin.</div>;
  }

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await getAllStudents();
        setStudents(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (err: any) {
        setError('Gagal memuat data siswa');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleExportCSV = () => {
    if (!students.length) return;
    const header = ['Nama', 'Email', 'XP', 'Level Saat Ini'];
    const rows = students.map(s => [s.name, s.email, s.xp, s.current_level]);
    let csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'daftar_siswa.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold mb-2 sm:mb-0">Daftar Siswa</h1>
        <button
          className="flex items-center bg-accent-600 hover:bg-accent-700 text-white px-4 py-2 rounded shadow transition-all"
          onClick={handleExportCSV}
          disabled={loading || students.length === 0}
        >
          <Download size={18} className="mr-2" />
          Export ke CSV
        </button>
      </div>
      {loading ? (
        <div>Memuat...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-neutral-900 rounded-lg shadow-lg">
            <thead>
              <tr className="bg-neutral-800 text-primary-300">
                <th className="py-3 px-4 text-left">Nama</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">XP</th>
                <th className="py-3 px-4 text-left">Level Saat Ini</th>
                <th className="py-3 px-4 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-primary-900/30 cursor-pointer border-b border-neutral-800 transition-all" onClick={() => navigate(`/admin/students/${student.id}`)}>
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4">{student.xp}</td>
                  <td className="py-2 px-4">{student.current_level}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded shadow"
                      onClick={e => { e.stopPropagation(); navigate(`/admin/students/${student.id}`); }}
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentList; 