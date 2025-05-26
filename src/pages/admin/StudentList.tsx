import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '../../services/studentService';
import { useAuth } from '../../contexts/AuthContext';

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

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Daftar Siswa</h1>
      {loading ? (
        <div>Memuat...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-neutral-900 rounded-lg">
            <thead>
              <tr>
                <th className="py-2 px-4">Nama</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">XP</th>
                <th className="py-2 px-4">Level Saat Ini</th>
                <th className="py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-neutral-800 cursor-pointer" onClick={() => navigate(`/admin/students/${student.id}`)}>
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="py-2 px-4">{student.email}</td>
                  <td className="py-2 px-4">{student.xp}</td>
                  <td className="py-2 px-4">{student.current_level}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1 rounded"
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