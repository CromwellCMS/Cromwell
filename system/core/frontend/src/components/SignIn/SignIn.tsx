import { TUser } from '@cromwell/core';
import clsx from 'clsx';
import React, { useState } from 'react';

import { TAuthClientOperationResult, useAuthClient } from '../../helpers/AuthClient';
import { BaseButton, TBaseButton } from '../BaseElements/BaseButton';
import { BaseTextField, TBaseTextField } from '../BaseElements/BaseTextField';
import styles from './SignIn.module.scss';

export type TSignInFromType = 'sign-in' | 'forgot-pass' | 'reset-pass';

type TSubmitEvent = React.FormEvent<HTMLFormElement> | React.MouseEvent<Element, MouseEvent>;

export type SignInProps = {
  /**
   * CSS classes to pass to elements
   */
  classes?: Partial<Record<'root' | 'resetPassInstructions' | 'forgotPassButton' | 'backToSignInButton', string>>;

  /**
   * Translate/change text on elements
   */
  text?: {
    resetPassInstructions?: string;
    fieldRequired?: string;
    forgotPass?: string;
    loginButton?: string;
    forgotPassButton?: string;
    resetPassButton?: string;
    backToSignIn?: string;
  };

  /**
   * Custom components to override default ones
   */
  elements?: {
    Button?: TBaseButton;
    TextField?: TBaseTextField;
    EmailField?: TBaseTextField;
    PasswordField?: TBaseTextField;
    CodeField?: TBaseTextField;
  };

  /**
   * Type of form to open initially. `sign-in` by default;
   */
  initialFormType?: TSignInFromType;

  /**
   * Called when user successfully authenticated
   */
  onSignInSuccess?: (user: TUser) => any;

  /**
   * Called when user tried to authenticate and get an error;
   */
  onSignInError?: (error: TAuthClientOperationResult) => any;

  /**
   * Called when user initiates password recovery procedure and email has been sent
   * with a secret code to reset password.
   */
  onForgotPasswordEmailSent?: (email: string) => any;

  /**
   * Called when user tried to initiate password recovery procedure and get an error;
   */
  onForgotPasswordFailure?: (error: TAuthClientOperationResult) => any;

  /**
   * Called when user entered a reset code with a new password and password
   * has been updated at the server.
   */
  onResetPasswordSuccess?: (email?: string, newPassword?: string) => any;

  /**
   * Called when user entered reset code with a new password and get an error from server;
   */
  onResetPasswordFailure?: (error: TAuthClientOperationResult) => any;
};

export function SignIn(props: SignInProps) {
  const { classes, elements, text } = props;
  const { TextField = BaseTextField, Button = BaseButton } = elements ?? {};
  const { EmailField = TextField, PasswordField = TextField, CodeField = TextField } = elements ?? {};

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [codeInput, setCodeInput] = useState('');
  const [submitPressed, setSubmitPressed] = useState(false);
  const [formType, setFormType] = useState<TSignInFromType>(props.initialFormType ?? 'sign-in');
  const authClient = useAuthClient();

  const handleSigIn = async (e: TSubmitEvent) => {
    e.preventDefault();
    setSubmitPressed(true);

    const result = await authClient.signIn(emailInput, passwordInput);

    if (result.success && result.user) {
      props.onSignInSuccess?.(result.user);
    } else {
      props.onSignInError?.(result);
    }
  };

  const handleForgotPass = async (e: TSubmitEvent) => {
    e.preventDefault();
    setSubmitPressed(true);

    const result = await authClient.forgotPassword(emailInput);

    if (result.success) {
      props.onForgotPasswordEmailSent?.(emailInput);
      setFormType('reset-pass');
    } else {
      props.onForgotPasswordFailure?.(result);
    }

    setSubmitPressed(false);
  };

  const handleResetPass = async (event: TSubmitEvent) => {
    event.preventDefault();
    setSubmitPressed(true);

    const result = await authClient.resetPassword(emailInput, passwordInput, codeInput);

    if (result.success) {
      props.onResetPasswordSuccess?.(emailInput, passwordInput);
      setFormType('sign-in');
    } else {
      props.onResetPasswordFailure?.(result);
    }

    setSubmitPressed(false);
  };

  const onSubmit = (event: TSubmitEvent) => {
    if (formType === 'sign-in') {
      handleSigIn(event);
    }
    if (formType === 'forgot-pass') {
      handleForgotPass(event);
    }
    if (formType === 'reset-pass') {
      handleResetPass(event);
    }
  };

  const fieldRequiredText = text?.fieldRequired ?? 'This field is required';

  let buttonText;
  if (formType === 'sign-in') {
    buttonText = text?.loginButton ?? 'Login';
  }
  if (formType === 'forgot-pass') {
    buttonText = text?.forgotPassButton ?? 'Reset password';
  }
  if (formType === 'reset-pass') {
    buttonText = text?.resetPassButton ?? 'Change password';
  }

  return (
    <form className={clsx(styles.SignIn, classes?.root)} onSubmit={onSubmit}>
      {formType === 'reset-pass' && (
        <p className={clsx(classes?.resetPassInstructions)}>
          {text?.resetPassInstructions ??
            'We sent you an e-mail with reset code. Copy the code below and create a new password'}
        </p>
      )}
      <EmailField
        label="E-mail"
        value={emailInput}
        onChange={(e) => setEmailInput(e.target.value)}
        fullWidth
        variant="standard"
        error={!emailInput && submitPressed}
        helperText={!emailInput && submitPressed ? fieldRequiredText : undefined}
        className={styles.signInField}
      />
      {formType === 'reset-pass' && (
        <CodeField
          label="Code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          fullWidth
          variant="standard"
          error={!codeInput && submitPressed}
          helperText={!codeInput && submitPressed ? fieldRequiredText : undefined}
          className={styles.signInField}
        />
      )}
      {(formType == 'sign-in' || formType === 'reset-pass') && (
        <PasswordField
          label="Password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          fullWidth
          variant="standard"
          error={!passwordInput && submitPressed}
          helperText={!passwordInput && submitPressed ? fieldRequiredText : undefined}
          className={styles.signInField}
        />
      )}
      {formType === 'sign-in' ? (
        <p
          className={clsx(classes?.forgotPassButton, styles.forgotPassButton)}
          onClick={() => {
            setFormType('forgot-pass');
          }}
        >
          {text?.forgotPass ?? 'Forgot your password?'}
        </p>
      ) : (
        <p
          className={clsx(classes?.backToSignInButton, styles.backToSignInButton)}
          onClick={() => {
            setFormType('sign-in');
          }}
        >
          {text?.backToSignIn ?? 'Back to sign in'}
        </p>
      )}
      <Button type="submit" onClick={onSubmit} disabled={authClient.isPending} className={styles.signInSubmitBtn}>
        {buttonText}
      </Button>
    </form>
  );
}
