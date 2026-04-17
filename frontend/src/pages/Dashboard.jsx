import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user's resumes on mount
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resume');
        setResumes(response.data || []);
      } catch (err) {
        console.error('Failed to fetch resumes:', err);
        toast.error('Could not load resumes');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleEdit = (id) => {
    // Route to Builder page, passing the resume id (you may adjust route as needed)
    navigate(`/builder/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resume permanently?')) return;
    try {
      await api.delete(`/resume/${id}`);
      setResumes((prev) => prev.filter((r) => r._id !== id));
      toast.success('Resume deleted');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Could not delete resume');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <span className="text-gray-600">Loading resumes…</span>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">My Resumes</h1>
      {resumes.length === 0 ? (
        <p className="text-gray-600">You haven't saved any resumes yet.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <div
              key={resume._id}
              className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-800 truncate">
                {resume.title || 'Untitled Resume'}
              </h2>
              <p className="text-sm text-gray-500 mt-2 truncate">
                Template: {resume.template}
              </p>
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  onClick={() => handleEdit(resume._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(resume._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
