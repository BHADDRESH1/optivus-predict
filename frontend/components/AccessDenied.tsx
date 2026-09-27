import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound, Lock, UserCheck } from 'lucide-react';
import { Button } from './ui';
import { Role } from '../types';
import { getRoleInfo } from '../permissions';
import { useAuth } from '../context/AuthContext';

interface AccessDeniedProps {
  moduleName?: string;
  userRole?: Role | string;
  allowedRoles?: Role[];
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  moduleName = 'this administrative module',
  userRole,
  allowedRoles = [Role.ADMIN]
}) => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const roleInfo = getRoleInfo(userRole);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl border border-rose-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Banner */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 text-white text-center">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldAlert size={36} className="text-white" />
          </div>
          <span className="bg-rose-900/50 text-rose-100 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            RBAC Authorization Guard • 403 Forbidden
          </span>
          <h2 className="text-2xl font-bold mt-2">Access Denied</h2>
          <p className="text-rose-100 text-sm mt-1">
            You do not have permission to access <strong className="text-white underline">{moduleName}</strong>.
          </p>
        </div>

        {/* Details Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Your Active Role:</span>
              <span className={`px-2.5 py-1 rounded-full font-bold text-xs border ${roleInfo.badgeColor}`}>
                {roleInfo.label}
              </span>
            </div>
            
            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Required Role(s):</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {allowedRoles.map(r => {
                  const allowedInfo = getRoleInfo(r);
                  return (
                    <span key={r} className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[11px]">
                      {allowedInfo.badge}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200">
              <span className="text-slate-500 font-semibold uppercase tracking-wider">Data Scope:</span>
              <span className="text-slate-700 font-medium">{roleInfo.scope}</span>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2.5">
            <Lock size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <p>
              Under OPTIVUS Predict role governance, this resource is restricted to authorized roles. Direct URL navigation has been blocked.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5"
            >
              <ArrowLeft size={16} />
              <span>Return to Dashboard</span>
            </Button>

            {/* Quick Demo Switcher if switchRole is available */}
            {switchRole && allowedRoles.length > 0 && (
              <div className="pt-2 text-center">
                <p className="text-[11px] text-slate-400 font-medium mb-1.5 uppercase tracking-wider">
                  Judge / Demo Quick Switch:
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {allowedRoles.map(r => {
                    const info = getRoleInfo(r);
                    return (
                      <button
                        key={r}
                        onClick={() => switchRole(r)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-700 font-semibold hover:bg-purple-100 transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <UserCheck size={13} />
                        <span>Switch to {info.badge}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
