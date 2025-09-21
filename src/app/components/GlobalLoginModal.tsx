"use client";

import React from 'react';
import CustomDialog from './openingModal';
import { useLoginModal } from '@/lib/login-modal-context';

const GlobalLoginModal: React.FC = () => {
  const { isLoginModalOpen, closeLoginModal } = useLoginModal();

  return (
    <CustomDialog 
      open={isLoginModalOpen} 
      onClose={closeLoginModal} 
    />
  );
};

export default GlobalLoginModal;
