import { TUser } from '@cromwell/core';
import { SignIn, SignInProps, SignUp, useAuthClient } from '@cromwell/core-frontend';
import { Button, Tab, Tabs, TextField } from '@mui/material';
import React, { useState } from 'react';

import commonStyles from '../../../styles/common.module.scss';
import { toast } from '../../toast/toast';
import Modal from '../baseModal/Modal';
import { PasswordField } from './PasswordField';
import styles from './SignIn.module.scss';

export type TFromType = 'sign-in' | 'sign-up';

export default function SignInModal(props: {
  open: boolean;
  type: TFromType;
  onClose: () => any;
  onSignIn: (user: TUser) => any;
}) {
  const [activeTab, setActiveTab] = useState<number | null>(props.type === 'sign-up' ? 1 : 0);
  const [formType, setFormType] = useState<TFromType>(props.type);
  const authClient = useAuthClient();

  const handleTabChange = (event: React.ChangeEvent<unknown>, newValue: number) => {
    setActiveTab(newValue);
    if (newValue === 1) setFormType('sign-up');
    if (newValue === 0) setFormType('sign-in');
  };

  const onSignUpSuccess = async (user: TUser, password: string) => {
    if (!user.email) return;
    // Automatic sign-in after sign-up 
    const result = await authClient.signIn(user.email, password);
    if (result.success) {
      props.onSignIn?.(user);
      toast.success('You have been registered')
    } else {
      toast.error(result.message);
    }
  }

  const signInElements: SignInProps['elements'] = {
    TextField: (props) => <TextField fullWidth
      variant="standard"
      size="small"
      className={styles.textField}
      {...props}
    />,
    PasswordField,
    Button: (props: any) => <Button
      color="primary"
      variant="contained"
      className={styles.loginBtn}
      {...props} />
  }

  return (
    <Modal
      className={commonStyles.center}
      open={props.open}
      onClose={props.onClose}
      blurSelector={"#CB_root"}
    >
      <div className={styles.SingIn}>
        <Tabs
          className={styles.tabs}
          value={activeTab}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
        >
          <Tab
            className={styles.tab}
            label="Sign in" />
          <Tab
            className={styles.tab}
            label="Sign up" />
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
            onSignInSuccess={props.onSignIn}
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
    </Modal >
  )
}


