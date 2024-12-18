"use client"
import { useEffect, useState } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/firebase';
declare global {
  interface Window {
    recaptchaVerifier: import('firebase/auth').RecaptchaVerifier;
  }
}

const LoginModal = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  // Initialize reCAPTCHA on mount
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      const verifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container', // This ID must exist in your JSX
        {
          size: 'invisible', // Set 'normal' for visible reCAPTCHA
          callback: () => console.log('reCAPTCHA verified'),
        },
       
      );
      window.recaptchaVerifier = verifier;
      setRecaptchaVerifier(verifier);
    }
  }, []);

  const requestOtp = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!recaptchaVerifier) {
      console.error('RecaptchaVerifier not initialized.');
      return;
    }

    try {
      const phoneNumberWithCountryCode = `+91${phoneNumber}`;
      const result = await signInWithPhoneNumber(auth, phoneNumberWithCountryCode, recaptchaVerifier);
      setConfirmationResult(result);
      console.log('OTP sent successfully!');
    } catch (error) {
      console.error('Error sending OTP: ', error);
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div> {/* Container for reCAPTCHA */}
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Enter phone number"
      />
      <button onClick={requestOtp}>Send OTP</button>
      {confirmationResult && <p>Verification ID: {confirmationResult.verificationId}</p>}
    </div>
  );
};

export default LoginModal;
