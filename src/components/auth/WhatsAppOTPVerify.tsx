import { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import axios from 'axios';

interface WhatsAppOTPVerifyProps {
  phoneNumber: string;
  onSuccess: (token: string) => void;
  onBack: () => void;
}

export const WhatsAppOTPVerify = ({
  phoneNumber,
  onSuccess,
  onBack,
}: WhatsAppOTPVerifyProps) => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const handleVerifyOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/whatsapp/verify-otp`, {
        phoneNumber,
        otp,
      });

      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onSuccess(response.data.token);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    setResendTimer(60);

    try {
      await axios.post(`${API_URL}/whatsapp/resend-otp`, {
        phoneNumber,
      });

      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold">Verify WhatsApp OTP</h2>
      <p className="text-gray-600">
        Enter the OTP sent to {phoneNumber}
      </p>

      <div className="space-y-2">
        <label htmlFor="otp" className="text-sm font-medium">
          One-Time Password
        </label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter 6-digit OTP"
          value={otp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value.slice(0, 6))}
          maxLength={6}
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={handleVerifyOTP}
        disabled={otp.length !== 6 || loading}
        className="w-full"
      >
        {loading ? 'Verifying...' : 'Verify OTP'}
      </Button>

      <Button
        onClick={handleResendOTP}
        variant="secondary"
        disabled={resendTimer > 0 || loading}
      >
        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
      </Button>

      <Button onClick={onBack} variant="secondary" className="w-full">
        Back
      </Button>
    </div>
  );
};
