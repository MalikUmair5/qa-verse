"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { aclonica } from '@/app/layout';
import RequestResetForm from './RequestResetForm';
import VerifyOTPForm from './VerifyOTPForm';
import ConfirmResetForm from './ConfirmResetForm';
import Link from 'next/link';

type ResetStep = 'request' | 'verify' | 'confirm' | 'success';

function ResetPasswordPage() {
  const [currentStep, setCurrentStep] = useState<ResetStep>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleRequestSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setCurrentStep('verify');
  };

  const handleVerifySuccess = (verifiedOtp: string) => {
    setOtp(verifiedOtp);
    setCurrentStep('confirm');
  };

  const handleConfirmSuccess = () => {
    setCurrentStep('success');
  };

  const handleBackToRequest = () => {
    setEmail('');
    setOtp('');
    setCurrentStep('request');
  };

  const handleBackToVerify = () => {
    setOtp('');
    setCurrentStep('verify');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'request':
        return (
          <RequestResetForm 
            onSuccess={handleRequestSuccess}
          />
        );
      case 'verify':
        return (
          <VerifyOTPForm 
            email={email}
            onSuccess={handleVerifySuccess}
            onBackToRequest={handleBackToRequest}
          />
        );
      case 'confirm':
        return (
          <ConfirmResetForm 
            email={email}
            otp={otp}
            onSuccess={handleConfirmSuccess}
            onBackToVerify={handleBackToVerify}
          />
        );
      case 'success':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <div className="text-6xl mb-4">✅</div>
            <h2 className={`text-2xl font-bold mb-4 ${aclonica.className}`}>
              Password Reset Successfully!
            </h2>
            <p className="text-white/70 mb-6">
              Your password has been updated. You can now sign in with your new password.
            </p>
            <Link href="/signin">
              <button className="bg-[#A33C13] text-white px-6 py-3 rounded-lg hover:bg-[#8B2F10] transition-colors">
                Go to Sign In
              </button>
            </Link>
          </motion.div>
        );
      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'request':
        return 'Reset Password';
      case 'verify':
        return 'Verify Email';
      case 'confirm':
        return 'New Password';
      case 'success':
        return 'Success';
      default:
        return 'Reset Password';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'request':
        return 'Enter your email address to receive a reset code';
      case 'verify':
        return 'Enter the 6-digit code sent to your email';
      case 'confirm':
        return 'Create your new password';
      case 'success':
        return '';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden relative">
      {/* Background Image - Same as Login/Signup */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0"></div>
        <div className="absolute inset-0">
          <img
            src="/loginBGImage.png"
            alt="Housing community"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Left Side - Welcome Section */}
      <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-16 z-10 relative text-white'>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`${aclonica.className} capitalize text-center text-xl mb-4`}>
          Secure Account Recovery
        </motion.h2>
        <motion.h1
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={`text-5xl font-bold ${aclonica.className} uppercase text-center mb-6`}>
          Reset Your <span className="text-4xl font-bold text-amber-800">Password</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className='text-lg mt-4 max-w-md text-center'>
          Don't worry, it happens to the best of us. Follow the steps to securely reset your password and get back to testing.
        </motion.p>
      </div>

      {/* Right Side - Reset Form */}
      <div className='flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-16 z-10 relative text-white'>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className='w-full max-w-md rounded-lg shadow-2xl p-8 border border-[#A33C13] relative z-10'>

          {currentStep !== 'success' && (
            <>
              <motion.h1
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className={`text-4xl font-bold ${aclonica.className} uppercase text-center mb-4`}>
                {getStepTitle()}
              </motion.h1>

              {getStepDescription() && (
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center mb-6 text-white/70"
                >
                  {getStepDescription()}
                </motion.p>
              )}
            </>
          )}

          {/* Form Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col gap-4"
          >
            {renderStepContent()}

            {/* Footer - Only show on request step */}
            {currentStep === 'request' && (
              <>
                <div className="flex items-center my-4">
                  <div className="flex-grow border-t border-white/30"></div>
                  <span className="mx-3 text-white/70">or</span>
                  <div className="flex-grow border-t border-white/30"></div>
                </div>

                <Link href="/signin" className="cursor-pointer">
                  <button className="w-full text-center text-white/70 hover:text-white transition-colors">
                    Remember your password? Sign in
                  </button>
                </Link>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;