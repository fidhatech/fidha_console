import { useState } from 'react';
import { Button } from '../../ui/Button/Button';
import { Input } from '../../ui/Input/Input';
import axios from 'axios';

export const WhatsAppLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';

  const initiateWhatsAppLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/whatsapp/initiate-login`,
        {
          phoneNumber: phoneNumber.replace(/\D/g, ''),
          redirectUrl: `${window.location.origin}/whatsapp-callback`,
        }
      );

      if (response.data.success) {
        // Redirect to WhatsApp login
        window.location.href = response.data.authUrl;
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to initiate login');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format phone number
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 15) {
      setPhoneNumber(value);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h2 className="text-2xl font-bold">Login with WhatsApp</h2>
      
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          WhatsApp Phone Number
        </label>
        <Input
          id="phone"
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={handlePhoneChange}
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          Include country code (e.g., +1 for US)
        </p>
      </div>

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      <Button
        onClick={initiateWhatsAppLogin}
        disabled={!phoneNumber || loading}
        className="w-full"
      >
        {loading ? 'Connecting...' : 'Continue with WhatsApp'}
      </Button>
    </div>
  );
};
