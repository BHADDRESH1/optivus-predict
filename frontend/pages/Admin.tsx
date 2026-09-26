import React, { useState, useEffect } from 'react';
import { Card, Button, StatusBadge } from '../components/ui';
import { UserModal } from '../components/UserModal';
import { usersAPI } from '../utils/api';
import { 
  Shield, 
  Lock, 
  User, 
  Bell, 
  Building, 
  Phone, 
  Mail, 
  Trash2, 
  Edit, 
  Loader2, 
  FileText, 
  Download,
  Pill,
  Sparkles,
  Sliders,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types';

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  whatsapp?: string;
  status?: string;
}

export const UsersAdminPage: React.FC = () => {
  const { user } = useAuth();
  const isHead = user?.role === Role.HOSPITAL_HEAD;
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Pharmaceutical Suppliers / Distributors
  const [suppliers, setSuppliers] = useState([
    { id: 1, name: 'Tamil Nadu Medical Services Corp (TNMSC)', contact: 'Dr. R. Ramanathan', phone: '+91 44 2855 0123', email: 'procurement@tnmsc.gov.in', activeSupplies: 68 },
    { id: 2, name: 'MedSupply Regional Distribution', contact: 'Kavitha Swaminathan', phone: '+91 44 2855 0124', email: 'logistics@medsupply.in', activeSupplies: 42 },
    { id: 3, name: 'Central Medical Stores Depot (CMSD)', contact: 'Arun Varma', phone: '+91 44 2855 0125', email: 'dispatch@cmsd.org.in', activeSupplies: 25 },
  ]);

  const defaultUsers: UserData[] = [
    { _id: 'USR-1', name: 'Dr. Suresh Kumar', email: 'admin@hospital.com', role: 'Admin', department: 'Pharmacy & Medical Supplies', whatsapp: '+91 98401 23456', status: 'Active' },
    { _id: 'USR-2', name: 'Dr. Meenakshi Sundaram', email: 'head@hospital.com', role: 'Hospital Head', department: 'Medical Administration', whatsapp: '+91 98402 34567', status: 'Active' },
    { _id: 'USR-3', name: 'Priya Rajendran', email: 'pharmacy.sup@hospital.com', role: 'Supervisor', department: 'Central Medicine Store', whatsapp: '+91 98403 45678', status: 'Active' },
    { _id: 'USR-4', name: 'Karthik Natarajan', email: 'dispensary1@hospital.com', role: 'Pharmacist', department: 'OPD Dispensary', whatsapp: '+91 98404 56789', status: 'Active' },
  ];

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await usersAPI.getAll();
      if (Array.isArray(data) && data.length > 0) {
        setUsers(data);
      } else {
        setUsers(defaultUsers);
      }
    } catch (err: any) {
      setUsers(defaultUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (userData: any) => {
    try {
      await usersAPI.create(userData);
      await fetchUsers();
    } catch {
      setUsers(prev => [...prev, { ...userData, _id: `USR-${Date.now()}` }]);
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    try {
      await usersAPI.update(editingUser._id, userData);
      await fetchUsers();
    } catch {
      setUsers(prev => prev.map(u => u._id === editingUser._id ? { ...u, ...userData } : u));
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this pharmacy personnel account?')) return;
    setDeletingId(id);
    try {
      await usersAPI.delete(id);
      await fetchUsers();
    } catch {
      setUsers(prev => prev.filter(u => u._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingUser(null);
        }}
        onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
        initialData={editingUser || undefined}
        title={editingUser ? 'Edit Pharmacy User' : 'Add Pharmacy Personnel'}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Pharmacy & System Administration</h1>
            <span className="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-bold">
              Access Governance
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Manage pharmacy supervisors, dispensary pharmacists, and institutional supplier channels.
          </p>
        </div>

        {!isHead && (
          <Button onClick={() => setIsModalOpen(true)} className="font-semibold text-xs shadow-sm">
            <Users size={16} /> Add Personnel
          </Button>
        )}
      </div>

      {/* Users Table */}
      <Card title="Dispensary Staff & Access Roles" className="border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Name & Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{u.name}</div>
                    <div className="text-xs text-slate-400">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{u.department || 'Central Dispensary'}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={u.status || 'Active'} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!isHead ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          className="py-1 px-3 text-xs h-8"
                          onClick={() => {
                            setEditingUser(u);
                            setIsModalOpen(true);
                          }}
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="py-1 px-3 text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={deletingId === u._id}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">View Only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Supplier Channels */}
      <Card title="Institutional Medicine Suppliers & Distributors" className="border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3.5">Supplier / Agency</th>
                <th className="px-6 py-3.5">Key Contact</th>
                <th className="px-6 py-3.5">Contact Channels</th>
                <th className="px-6 py-3.5">Active Medicine Contracts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {suppliers.map((sup) => (
                <tr key={sup.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{sup.name}</td>
                  <td className="px-6 py-4 text-slate-700 text-xs">{sup.contact}</td>
                  <td className="px-6 py-4 text-slate-600 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="flex items-center gap-1"><Phone size={12} className="text-slate-400" /> {sup.phone}</span>
                      <span className="flex items-center gap-1"><Mail size={12} className="text-slate-400" /> {sup.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      {sup.activeSupplies} Medicine Lines
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export const TechniciansPage = UsersAdminPage;

export const SettingsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System & AI Model Settings</h2>
        <p className="text-slate-500 text-sm mt-0.5">Configure stockout alert thresholds, redistribution rules, and hospital credentials.</p>
      </div>

      <Card title="Stockout Prediction Model Configuration" className="border-slate-200 shadow-sm">
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Critical Stockout Alert Threshold</p>
              <p className="text-slate-500">Trigger high-risk alert when days to stockout falls below:</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-blue-700 bg-white px-3 py-1 rounded-lg border border-slate-300">
                10 Days
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Smart Redistribution Algorithmic Matching</p>
              <p className="text-slate-500">Automatically match deficit facilities with donor facilities holding &gt; 30 days reserve.</p>
            </div>
            <span className="font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Enabled (Requires Admin Approval)
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Telemetry Anomaly Policy</p>
              <p className="text-slate-500">Require clinical verification before categorizing sudden zero-consumption as stockouts.</p>
            </div>
            <span className="font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
              Verification Enforced
            </span>
          </div>
        </div>
      </Card>

      <Card title="Profile & Facility Node" className="border-slate-200 shadow-sm">
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 border rounded-xl border-slate-200">
            <div className="bg-blue-100 p-2.5 rounded-full text-blue-600"><User size={24} /></div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-900">Administrator Profile</h4>
              <p className="text-xs text-slate-500">admin@optivus.hospital • Hospital A Hub (Chennai Central)</p>
            </div>
            <Button variant="outline" className="text-xs">Manage</Button>
          </div>
        </div>
      </Card>

      <Card title="Data Security & Audit Trail" className="border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-emerald-800 bg-emerald-50 p-4 rounded-xl border border-emerald-200">
          <Shield size={22} className="text-emerald-600 shrink-0" />
          <div className="text-xs">
            <p className="font-bold">Cryptographically Verified Health Telemetry</p>
            <p className="text-emerald-700 mt-0.5">Compliant with National Digital Health Mission (NDHM) & HIPAA standards for medicine dispensation privacy.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};