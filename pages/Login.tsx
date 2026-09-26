import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Building } from 'lucide-react';
import { Button } from '../components/ui';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>(Role.ADMIN);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [useDemoMode, setUseDemoMode] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (useDemoMode) {
        // Demo mode - no backend required
        await login(email, password, true, role);
      } else {
        // Real API login
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      const errorMsg = err.message || 'Invalid credentials. Please try again.';
      setError(errorMsg);
      // If backend is not available, suggest demo mode
      if (errorMsg.includes('not available') || errorMsg.includes('not running')) {
        setError(`${errorMsg} You can use Demo Mode below to continue.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-center">
          <div className="inline-flex items-center gap-2 font-bold text-3xl text-white tracking-tight mb-2">
            <span className="bg-white text-blue-600 rounded-lg px-2 py-0.5">OP</span>
            TIVUS
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/80 text-white font-semibold uppercase tracking-wider ml-1">Predict</span>
          </div>
          <p className="text-blue-100 font-medium text-sm">AI-Powered Medicine Stockout Prediction & Smart Redistribution</p>
          <div className="mt-2 inline-flex items-center gap-2 bg-blue-700/60 px-3 py-1 rounded-full text-[11px] text-blue-200 font-medium">
            <span>Sustain-a-thon 2026</span>
            <span>•</span>
            <span>PS-03-S2</span>
            <span>•</span>
            <span>SDG 3</span>
          </div>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 text-center">
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Hospital ID / Administrator Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="email"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="admin@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input 
                  type="password"
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!useDemoMode}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Access Role</label>
              <select 
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium text-slate-700"
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
              >
                <option value={Role.ADMIN}>System Admin (Full Access)</option>
                <option value={Role.HOSPITAL_HEAD}>Hospital Head (Executive View)</option>
                <option value={Role.SUPERVISOR}>Pharmacy Supervisor</option>
                <option value={Role.PHARMACIST}>Dispensary Pharmacist</option>
              </select>
            </div>

            {/* Demo Mode Toggle */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={useDemoMode}
                  onChange={(e) => setUseDemoMode(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
                />
                <span className="text-sm font-medium text-blue-900">Demo Prototype Mode (Instant offline access)</span>
              </label>
            </div>

            <div className="flex items-center justify-between text-sm">
               <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                 <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                 Remember session
               </label>
               <button type="button" className="text-blue-600 hover:underline font-medium">Forgot credentials?</button>
            </div>

            <Button type="submit" className="w-full py-2.5 text-base font-semibold" disabled={loading}>
              {loading ? 'Authenticating...' : 'Enter Medicine Intelligence Portal'}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-xs text-slate-400">
            &copy; 2026 OPTIVUS Predict. PS-03-S2 Medicine Supply Intelligence.
          </div>
        </div>
      </div>
    </div>
  );
};