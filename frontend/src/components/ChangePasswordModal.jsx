import { useState } from 'react';
import { XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import authService from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        try {
            setLoading(true);
            await authService.changePassword(formData.currentPassword, formData.newPassword);
            toast.success('Password changed successfully');
            onClose();
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.message || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-[#0a192f] border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center">
                        <KeyIcon className="w-6 h-6 mr-2 text-[#eec262]" />
                        Change Password
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Current Password</label>
                        <input
                            type="password"
                            required
                            value={formData.currentPassword}
                            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">New Password</label>
                        <input
                            type="password"
                            required
                            minLength={8}
                            value={formData.newPassword}
                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-300 mb-1">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#30d9fe] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex gap-3 pt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-all text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-[#30d9fe] text-[#03325a] font-bold rounded-lg hover:bg-[#30d9fe]/90 transition-all disabled:opacity-50 text-sm shadow-[0_0_15px_rgba(48,217,254,0.3)]"
                        >
                            {loading ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
