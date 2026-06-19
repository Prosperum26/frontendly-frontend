import React, { useState } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import type { UserProfile } from '../types/profile.types';

interface ProfileData {
  username?: string;
  bio?: string;
  dateOfBirth?: string;
  [key: string]: unknown;
}

export const EditProfileForm = ({ currentUser, onSuccess }: { currentUser: ProfileData | UserProfile | null, onSuccess: () => void }) => { 
  const initialUsername = currentUser?.username || '';
  const initialBio = currentUser?.bio || '';
  const initialDateOfBirth = currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '';

  const [username, setUsername] = useState<string>(initialUsername);
  const [bio, setBio] = useState<string>(initialBio);
  const [dateOfBirth, setDateOfBirth] = useState<string>(initialDateOfBirth);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [showSuccess, setShowSuccess] = useState(false);

  const isChanged = 
    username !== initialUsername ||
    bio !== initialBio ||
    dateOfBirth !== initialDateOfBirth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setShowSuccess(false);

    if (!username?.trim()) {
      setErrorMsg('Username is required!');
      setLoading(false);
      return;
    }

    if (dateOfBirth) {
      const selectedDate = new Date(dateOfBirth);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        setErrorMsg('Date of birth cannot be in the future!');
        setLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('http://localhost:3000/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ username, bio, dateOfBirth }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrorMsg(data.message || 'Session expired. Please log in again.');
        setLoading(false);
        return; 
      }

      if (data.success || response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch {
      setErrorMsg('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 mt-4 p-6 shadow-sm hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      <div className="space-y-6">
        
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
            <p className="text-red-600 text-sm font-bold">{errorMsg}</p>
          </div>
        )}

        {showSuccess && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-bold animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="w-5 h-5" />
            Profile updated successfully!
          </div>
        )}
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">New Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-900 shadow-sm hover:border-gray-300"
            placeholder="Enter new username"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
          <input
            type="date"
            value={dateOfBirth}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => setDateOfBirth(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-900 shadow-sm hover:border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none text-slate-900 shadow-sm hover:border-gray-300"
            placeholder="Tell us a little bit about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !isChanged}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};