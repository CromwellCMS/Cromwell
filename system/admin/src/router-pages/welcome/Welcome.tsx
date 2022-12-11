import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { CmsSettingsForm } from './components/CmsSettingsForm';
import { UserForm } from './components/UserForm';

export default function WelcomePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'account' | 'settings'>('account');

  const onAccountSuccess = () => {
    setStep('settings');
  };

  const onSettingsSuccess = () => {
    navigate(`/`);
  };

  return (
    <div className="dark:bg-black py-8 my-auto">
      <div className="bg-white rounded-lg mx-auto max-w-sm shadow-md w-full overflow-hidden dark:bg-gray-800">
        <div className="py-4 px-6">
          <img src="/admin/static/logo_small_black.svg" width="80px" className="mx-auto mt-3 mb-6" />
          {step === 'account' && <UserForm onSuccess={onAccountSuccess} />}
          {step === 'settings' && <CmsSettingsForm onSuccess={onSettingsSuccess} />}
        </div>
      </div>
    </div>
  );
}
