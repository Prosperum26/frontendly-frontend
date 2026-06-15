import React, { useState } from 'react';
interface ProfileData {
  username?: string;
  bio?: string;
  [key: string]: any;
}

export const EditProfileForm = ({ currentUser, onSuccess }: { currentUser: ProfileData | null, onSuccess: () => void }) => {
  const [username, setUsername] = useState<string>(currentUser?.username || '');
  const [bio, setBio] = useState<string>(currentUser?.bio || '');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

  try {
      const response = await fetch('http://localhost:3000/api/v1/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ username, bio }),
      });

      const data = await response.json();
      
      // 1. ADD THIS BLOCK: Stop if the backend returns an error (like 401 Expired)
      if (!response.ok) {
        setErrorMsg(data.message || 'Session expired. Please log in again.');
        setLoading(false);
        return; 
      }

      // 2. Only show success if the backend confirms it
      if (data.success) {
        alert('Profile updated successfully!');
        onSuccess();
      }
    } catch (_error) {
      setErrorMsg('Server connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 border rounded">
      <div>
        <label className="block text-sm font-bold mb-1 text-slate-900">New Username</label>
        <input 
          className="border p-2 w-full text-slate-900" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
        />
        {errorMsg && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-bold mb-1 text-slate-900">Bio</label>
        <textarea 
          className="border p-2 w-full text-slate-900" 
          value={bio} 
          onChange={(e) => setBio(e.target.value)} 
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 text-white py-2 px-4 rounded font-bold disabled:bg-slate-400"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};