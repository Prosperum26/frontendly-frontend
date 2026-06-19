import React, { useState } from 'react';
// ADDED: Import icons from lucide-react for visual effects
import { Loader2, CheckCircle2 } from 'lucide-react';
import { auth } from '../../../config/firebase'; // Hãy chỉnh lại số lượng dấu chấm ../ cho đúng đường dẫn đến file firebase của bạn
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import type { ConfirmationResult } from 'firebase/auth';
import type { UserProfile } from '../types/profile.types'; // Đường dẫn của bạn cứ giữ nguyên nhé

interface ProfileData {
  username?: string;
  bio?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  lastPhoneUpdatedAt?: string; // THÊM MỚI: trường kiểm tra thời gian đổi số
  [key: string]: unknown;
}

export const EditProfileForm = ({ currentUser, onSuccess }: { currentUser: ProfileData | UserProfile | null, onSuccess: () => void }) => { 
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
  
  // ADDED: State to manage smooth success banner display
  const [showSuccess, setShowSuccess] = useState(false);

  // --- BẮT ĐẦU ĐOẠN THÊM MỚI: State cho Firebase OTP ---
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [confirmResult, setConfirmResult] = useState<ConfirmationResult | null>(null);

  // Logic kiểm tra khóa 30 ngày
  const canEditPhone = () => {
const lastUpdate = (currentUser as ProfileData)?.lastPhoneUpdatedAt;  
  if (!lastUpdate) return true;
    const nextDate = new Date(lastUpdate);
    nextDate.setDate(nextDate.getDate() + 30);
    return new Date() >= nextDate;
  };
  const isPhoneLocked = !canEditPhone();
  // --- KẾT THÚC ĐOẠN THÊM MỚI ---

  const isChanged = 
    username !== initialUsername ||
    bio !== initialBio ||
    phoneNumber !== initialPhoneNumber ||
    dateOfBirth !== initialDateOfBirth;

  const isPhoneChanged = phoneNumber !== initialPhoneNumber; // THÊM MỚI: Biến kiểm tra xem user có đổi số không

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPhoneNumber(value);
    
    if (value.length > 0 && value.length !== 10) {
      setPhoneError('Phone number must be exactly 10 digits.');
    } else {
      setPhoneError('');
    }
  };

 // --- START OF NEW ADDITION: Send OTP Function ---
  const handleSendOtp = async () => {
    if (phoneError || !phoneNumber) return;
    try {
    if (!(window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier) {
  (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', { size: 'invisible' });
}
      // Convert to VN phone prefix +84
      const formattedPhone = phoneNumber.startsWith('0') ? '+84' + phoneNumber.slice(1) : phoneNumber;
      const res = await signInWithPhoneNumber(auth, formattedPhone, (window as Window & { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier);
      
      setConfirmResult(res);
      setShowOtp(true);
      setErrorMsg('');
    } catch (err) {
      console.error("OTP Error:", err);
      setErrorMsg("Cannot send OTP. Please check your phone number again.");
    }
  };
  // --- END OF NEW ADDITION ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setShowSuccess(false); // ADDED: Reset success state

    // ADDED: Frontend Validation Check
    if (!username?.trim()) {
      setErrorMsg('Username is required!');
      setLoading(false);
      return;
    }

    if (phoneNumber) {
      const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
      if (!phoneRegex.test(phoneNumber)) {
        setErrorMsg('Invalid phone number format. Please use a valid Vietnamese network provider.');
        setLoading(false);
        return;
      }
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

    // --- START OF NEW ADDITION: Verify OTP before calling Backend ---
    if (isPhoneChanged) {
      if (!confirmResult) {
        setErrorMsg('Please click "Send OTP" and verify your new phone number before saving.');
        setLoading(false);
        return;
      }
      try {
        await confirmResult.confirm(otpCode);
      } catch {
        setErrorMsg('Incorrect or expired OTP code!');
        setLoading(false);
        return;
      }
    }
    // --- END OF NEW ADDITION ---

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

      if (data.success || response.ok) {
        // ADDED: Trigger success effect before executing callback
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 1500); // ADDED: Slight delay so the user can see the green banner
      }
    } catch {
      setErrorMsg('Server connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ADDED: Padding, shadow, and smooth slide-in animation classes for the whole form
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 mt-4 p-6 shadow-sm hover:shadow-md transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* THÊM MỚI: Thẻ ẩn để load Recaptcha của Firebase */}
      <div id="recaptcha-container"></div>

      <div className="space-y-6">
        
        {/* ADDED: Error banner with fade/slide animation */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl animate-in fade-in slide-in-from-top-2">
            <p className="text-red-600 text-sm font-bold">{errorMsg}</p>
          </div>
        )}

        {/* ADDED: Smooth success banner */}
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
            // ADDED: Modern shadow-sm and focus glow effects
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-900 shadow-sm hover:border-gray-300"
            placeholder="Enter new username"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              maxLength={10}
              value={phoneNumber}
              onChange={handlePhoneChange}
              disabled={isPhoneLocked || showOtp} // THÊM MỚI: Khóa ô input nếu chưa đủ 30 ngày hoặc đang nhập OTP
              // ADDED: Modern shadow-sm and focus glow effects
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl focus:bg-white focus:outline-none focus:ring-4 transition-all duration-300 text-slate-900 shadow-sm hover:border-gray-300 ${
                phoneError ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-blue-500/20 focus:border-blue-500'
              } ${isPhoneLocked || showOtp ? 'cursor-not-allowed opacity-70 bg-slate-100' : ''}`} // THÊM MỚI: Đổi màu khi bị khóa
              placeholder="0912345678"
            />
            {/* ADDED: Slide-down effect for phone error message */}
            {phoneError && <p className="text-red-500 text-xs font-semibold mt-2 animate-in fade-in slide-in-from-top-1">{phoneError}</p>}
            
            {/* BẮT ĐẦU ĐOẠN THÊM MỚI: Giao diện OTP & Cảnh báo khóa */}
            {isPhoneLocked && (
              <p className="text-red-500 text-xs font-semibold mt-2">* Số điện thoại chỉ được đổi 30 ngày/lần.</p>
            )}
            
            {isPhoneChanged && !isPhoneLocked && !showOtp && !phoneError && (
              <button 
                type="button" 
                onClick={handleSendOtp} 
                className="mt-2 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                Gửi mã OTP để xác nhận số mới
              </button>
            )}

            {showOtp && (
              <div className="mt-3 flex gap-2 animate-in fade-in slide-in-from-top-2">
                <input 
                  type="text" 
                  value={otpCode} 
                  onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                  maxLength={6}
                  placeholder="Nhập 6 số OTP"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                />
                <button type="button" onClick={() => {setShowOtp(false); setConfirmResult(null);}} className="text-sm text-gray-500 hover:text-gray-700 px-2 font-semibold">
                  Hủy
                </button>
              </div>
            )}
            {/* KẾT THÚC ĐOẠN THÊM MỚI */}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              max={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDateOfBirth(e.target.value)}
              // ADDED: Modern shadow-sm and focus glow effects
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-slate-900 shadow-sm hover:border-gray-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            // ADDED: Modern shadow-sm and focus glow effects
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none text-slate-900 shadow-sm hover:border-gray-300"
            placeholder="Tell us a little bit about yourself..."
          />
        </div>

        <button
          type="submit"
          disabled={!!phoneError || loading || !isChanged}
          // ADDED: Flex layout for icon, hover lift effect (-translate-y), and shadow glow
          className="w-full mt-4 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:bg-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {/* ADDED: Spinning loading icon */}
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {loading ? 'Saving Changes...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};