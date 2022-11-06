import { TUser } from '@cromwell/core';
import { SignIn, SignInProps, SignUp, useAuthClient } from '@cromwell/core-frontend';
import { Button, Tab, Tabs, TextField } from '@mui/material';
import { observer } from 'mobx-react';
import React from 'react';

import { appState } from '../../../helpers/AppState';
import commonStyles from '../../../styles/common.module.scss';
import { toast } from '../../toast/toast';
import Modal from '../baseModal/Modal';
import { PasswordField } from './PasswordField';
import styles from './SignIn.module.scss';

export const SignInModal = observer(() => {
  const authClient = useAuthClient();
  const formType = appState.signInFormType;
  const activeTab = formType === 'sign-up' ? 1 : 0;

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    if (newValue === 1) appState.signInFormType = 'sign-up';
    if (newValue === 0) appState.signInFormType = 'sign-in';
  };

  const onSignUpSuccess = async (user: TUser, password: string) => {
    if (!user.email) return;
    // Automatic sign-in after sign-up
    const result = await authClient.signIn(user.email, password);
    if (result.success) {
      toast.success('You have been registered');
      handleClose();
    } else {
      toast.error(result.message);
    }
  };

  const handleClose = () => {
    appState.isSignInOpen = false;
    appState.signInFormType = 'sign-in';
  };

  const signInElements: SignInProps['elements'] = {
    TextField: (props) => (
      <TextField fullWidth variant="standard" size="small" className={styles.textField} {...props} />
    ),
    PasswordField,
    Button: (props: any) => <Button color="primary" variant="contained" className={styles.loginBtn} {...props} />,
  };

  return (
    <Modal className={commonStyles.center} open={appState.isSignInOpen} onClose={handleClose} blurSelector={'#CB_root'}>
      <div className={styles.SingIn}>
        <Tabs
          className={styles.tabs}
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
        >
          <Tab className={styles.tab} label="Sign in" />
          <Tab className={styles.tab} label="Sign up" />
        </Tabs>
        {formType === 'sign-in' && (
          <SignIn
            classes={{
              root: styles.loginForm,
              forgotPassButton: styles.forgotPassText,
              backToSignInButton: styles.forgotPassText,
              resetPassInstructions: styles.resetPassInstructions,
            }}
            elements={signInElements}
            onSignInSuccess={handleClose}
            onSignInError={(result) => toast.error(result.message)}
            onForgotPasswordFailure={(result) => toast.error(result.message)}
            onResetPasswordFailure={(result) => toast.error(result.message)}
            onForgotPasswordEmailSent={() => toast.success('We sent you an email')}
            onResetPasswordSuccess={() => toast.success('Password changed')}
          />
        )}
        {formType === 'sign-up' && (
          <SignUp
            classes={{ root: styles.loginForm }}
            elements={signInElements}
            onSignUpSuccess={onSignUpSuccess}
            onSignUpError={(result) => toast.error(result.message)}
          />
        )}
      </div>
    </Modal>
  );
});
