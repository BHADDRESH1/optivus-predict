import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui';
import { Role } from '../types';

interface User {
  _id?: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  whatsapp?: string;
  status?: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (userData: User & { password?: string }) => Promise<void> | void;
  onSubmit?: (userData: User & { password?: string }) => Promise<void> | void;
  user?: User | null;
  initialData?: User | null;
  mode?: 'create' | 'edit';
  title?: string;
}

export const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onSubmit, 
  user, 
  initialData, 
  mode,
  title 
}) => {
  const activeUser = user || initialData;
  const isEdit = mode === 'edit' || !!activeUser?._id;

  const [formData, setFormData] = useState<User & { password?: string }>({
    name: '',
    email: '',
    role: 'Pharmacist',
    department: 'Central Dispensary',
    whatsapp: '',
    status: 'Active',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activeUser) {
      setFormData({
        name: activeUser.name || '',
        email: activeUser.email || '',
        role: activeUser.role || 'Pharmacist',
        department: activeUser.department || 'Central Dispensary',
        whatsapp: activeUser.whatsapp || '',
        status: activeUser.status || 'Active',
        password: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'Pharmacist',
        department: 'Central Dispensary',
        whatsapp: '',
        status: 'Active',
        password: '',
      });
    }
    setError('');
  }, [isOpen, activeUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const handler = onSubmit || onSave;
      if (handler) {
        await handler(formData);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">
            {title || (isEdit ? 'Edit Pharmacy User' : 'Add Pharmacy Personnel')}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Dr. Rajesh Kumar"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="rajesh@hospital.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {isEdit ? 'New Password (leave blank to keep current)' : 'Password *'}
            </label>
            <input
              type="password"
              required={!isEdit}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Access Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            >
              <option value="Admin">System Administrator</option>
              <option value="Hospital Head">Hospital Head (Executive View)</option>
              <option value="Supervisor">Pharmacy Supervisor</option>
              <option value="Pharmacist">Dispensary Pharmacist</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dispensary / Department
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Inpatient Pharmacy / Central Store"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Emergency Contact / Mobile
            </label>
            <input
              type="text"
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="+91 98401 23456"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white outline-none"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Saving...' : (isEdit ? 'Save Changes' : 'Create User')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
