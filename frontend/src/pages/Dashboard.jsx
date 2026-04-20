import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, FileText, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) {
      toast.error('Please sign in to access your dashboard');
      navigate('/auth');
    }
  }, [isLoggedIn, authLoading, navigate]);

  // Fetch user's resumes and profile data on mount
  useEffect(() => {
    if (authLoading || !isLoggedIn) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch resumes
        let resumeData = [];
        try {
          const resumeRes = await api.get('/resume');
          resumeData = resumeRes.data.data || [];
          setResumes(resumeData);
        } catch (resumeErr) {
          console.error('Error fetching resumes:', resumeErr);
          toast.error('Could not load resumes');
        }

        // Fetch user stats (Credits & History)
        let userData = null;
        try {
          const userRes = await api.get('/auth/me');
          userData = userRes.data.data || userRes.data.user || userRes.data;
          
          if (userData && !Array.isArray(userData.analysisHistory)) {
            userData.analysisHistory = [];
          }
          
          setUserData(userData);
        } catch (userErr) {
          console.error('Error fetching user data:', userErr);
          throw new Error('Failed to load user data: ' + (userErr.message || 'Unknown error'));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.message || 'Could not load dashboard data');
        toast.error(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [authLoading, isLoggedIn]);

  const handleEdit = (id) => navigate(`/builder/${id}`);

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

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '—';
    }
  };

  const getScoreBadgeColor = (score) => {
    const numScore = parseInt(score) || 0;
    if (numScore >= 75) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50';
    if (numScore >= 50) return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50';
    return 'bg-red-500/20 text-red-300 border border-red-500/50';
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <span className="text-slate-400 font-medium">Loading your workspace…</span>
      </div>
    );
  }

  if (!isLoggedIn) return null;

  if (error && !userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <span className="text-slate-300 font-medium block mb-4">Error loading dashboard</span>
          <p className="text-slate-400 text-sm mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-24 pb-16" style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
      <div className="max-w-7xl mx-auto">
        
        {/* ─── HEADER ─── */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-2">Dashboard</h1>
          <p className="text-slate-400 text-lg">Welcome back, <span className="font-semibold text-slate-300">{userData?.name || 'User'}</span>! 👋</p>
        </div>

        {/* ─── STATS OVERVIEW SECTION ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* Available Credits Card */}
          <Link to="/pricing" className="group">
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-brand-500/50 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Available Credits</h3>
                  <p className="text-4xl font-black text-brand-400">
                    {userData?.credits !== undefined ? userData.credits : '0'}
                  </p>
                  <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-brand-500/60"></span>
                    {userData?.plan === 'premium' ? 'Premium Plan' : 'Free Plan'}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-brand-500/20 flex items-center justify-center group-hover:bg-brand-500/30 transition-colors">
                  <TrendingUp size={28} className="text-brand-400" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </Link>
          
          {/* Total Resumes Card */}
          <Link to="#resumes-section" className="group" onClick={() => document.getElementById('resumes-section')?.scrollIntoView({ behavior: 'smooth' })}>
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-blue-500/50 transition-all duration-300 cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Saved Resumes</h3>
                  <p className="text-4xl font-black text-blue-300">{resumes.length}</p>
                  <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500/60"></span>
                    Across all templates
                  </p>
                </div>
                <div className="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <FileText size={28} className="text-blue-400" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </Link>

          {/* AI Analyses Run Card */}
          <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-indigo-500/50 transition-all duration-300 h-full">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Analyses Run</h3>
                <p className="text-4xl font-black text-indigo-300">
                  {userData?.analysisHistory?.length || 0}
                </p>
                <p className="text-xs text-slate-500 mt-4 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-indigo-500/60"></span>
                  Total ATS scans
                </p>
              </div>
              <div className="w-14 h-14 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                <BarChart3 size={28} className="text-indigo-400" strokeWidth={1.5} />
              </div>
            </div>
          </div>
        </div>

        {/* ─── MY RESUMES SECTION ─── */}
        <div className="mb-14" id="resumes-section">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black text-white">My Resumes</h2>
            <button 
              onClick={() => navigate('/builder')} 
              className="text-sm bg-brand-600 hover:bg-brand-700 text-white px-5 py-3 rounded-xl transition-colors font-semibold shadow-lg shadow-brand-600/30"
            >
              + Create New
            </button>
          </div>
          
          {resumes.length === 0 ? (
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-16 text-center">
              <FileText size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300 font-semibold text-lg mb-1">You haven't saved any resumes yet.</p>
              <p className="text-slate-400 text-sm">Click "Create New" to get started with a professional resume template.</p>
            </div>
          ) : (
            <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {resumes.map((resume) => (
                <div key={resume._id} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-5 flex flex-col justify-between hover:bg-white/10 hover:border-white/20 transition-all duration-300 group">
                  <div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-brand-300 transition-colors truncate">
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-3 capitalize">
                      Template: <span className="font-medium text-slate-300">{resume.template}</span>
                    </p>
                  </div>
                  <div className="mt-5 flex gap-2 justify-end flex-wrap">
                    <button 
                      onClick={() => navigate('/interview/' + resume._id)} 
                      className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-semibold border border-purple-500 shadow-sm shadow-purple-600/20"
                    >
                      Start Interview (50 pts)
                    </button>
                    <button 
                      onClick={() => handleEdit(resume._id)} 
                      className="px-3 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 rounded-lg transition-colors text-sm font-medium border border-slate-700/50"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(resume._id)} 
                      className="px-3 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-300 rounded-lg transition-colors text-sm font-medium border border-red-900/50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── ATS ANALYSIS HISTORY SECTION ─── */}
        <div>
          <h2 className="text-3xl font-black text-white mb-8">ATS Analysis History</h2>
          {!userData?.analysisHistory || userData.analysisHistory.length === 0 ? (
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-16 text-center">
              <BarChart3 size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-300 font-semibold text-lg mb-1">No ATS analysis history found.</p>
              <p className="text-slate-400 text-sm">Visit the ATS Analyzer to scan your resume and build your analysis history.</p>
            </div>
          ) : (
            <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/10">
                  <thead className="bg-white/5 border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Target Role</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">ATS Score</th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-300 uppercase tracking-wider">Match %</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {/* Show latest 10 scans */}
                    {[...userData.analysisHistory].reverse().slice(0, 10).map((history, idx) => (
                      <tr key={idx} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-300">
                          {formatDate(history.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
                          {history.role || history.detectedRole || 'General Scan'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1.5 inline-flex text-xs leading-4 font-bold rounded-full ${getScoreBadgeColor(history.atsScore || history.score)}`}>
                            {history.atsScore || history.score || '—'}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-300">
                          {history.matchPercentage || history.matchPercent || '—'}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}