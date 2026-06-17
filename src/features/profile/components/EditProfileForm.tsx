import React, { useState } from 'react';

interface ProfileData {
  username?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  [key: string]: any;
}

export const EditProfileForm = ({ currentUser, onSuccess }: { currentUser: ProfileData | null, onSuccess: () => void }) => {
  // THÊM: Lưu lại các giá trị ban đầu để so sánh
  const initialUsername = currentUser?.username || '';
  const initialBio = currentUser?.bio || '';
  const initialPhoneNumber = currentUser?.phoneNumber || '';
  const initialDateOfBirth = currentUser?.dateOfBirth ? new Date(currentUser.dateOfBirth).toISOString().split('T')[0] : '';

  const [username, setUsername] = useState<string>(initialUsername);
  const [bio, setBio] = useState<string>(initialBio);
  const [phoneNumber, setPhoneNumber] = useState<string>(initialPhoneNumber);
  const [dateOfBirth, setDateOfBirth] = useState<string>(initialDateOfBirth);
  
  const [phoneError, setPhoneError] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // THÊM: Biến kiểm tra xem có bất kỳ trường nào bị thay đổi so với ban đầu không
  const isChanged = 
    username !== initialUsername ||
    bio !== initialBio ||
    phoneNumber !== initialPhoneNumber ||
    dateOfBirth !== initialDateOfBirth;

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
    
    if (value.length > 0 && value.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }
  };

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
        body: JSON.stringify({ username, bio, phoneNumber, dateOfBirth }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        setErrorMsg(data.message || 'Session expired. Please log in again.');
        setLoading(false);
        return; 
      }

      if (data.success) {
        alert('Profile updated successfully!');
        onSuccess();
      }
    } catch (_error) {
      setErrorMsg('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 mt-2">
      <div className="space-y-5">
        {errorMsg && <p className="text-red-500 text-sm font-bold mb-2">{errorMsg}</p>}
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900"
            placeholder="Enter new username"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="text"
              maxLength={10}
              value={phoneNumber}
              onChange={handlePhoneChange}
              className={`w-full px-4 py-2.5 bg-gray-50 border rounded-lg focus:bg-white focus:outline-none focus:ring-2 transition-all text-slate-900 ${
                phoneError ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/50 focus:border-blue-500'
              }`}
              placeholder="0912345678"
            />
            {phoneError && <p className="text-red-500 text-sm mt-1.5">{phoneError}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none text-slate-900"
            placeholder="Tell us a little bit about yourself..."
          />
        </div>

        <button
          type="submit"
          // THÊM: !isChanged vào điều kiện disabled
          disabled={!!phoneError || loading || !isChanged}
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};