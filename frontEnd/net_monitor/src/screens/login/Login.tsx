import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../../components/sharedTheme/AppTheme';
import { useEffect } from 'react';
import SignInContainer from './components/SignInContainer';

export default function Login(props: { disableCustomTheme?: boolean }) {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (emailError || passwordError) {
      event.preventDefault();
      return;
    }
    const data = new FormData(event.currentTarget);
  };
  
  const validateInputs = () => {
    const email = document.getElementById('email') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
    let isValid = true;
    
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }
    
    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }
    
    return isValid;
  };
  
  const signInContainerProps = {
    handleSubmit,
    validateInputs,
    emailError,
    emailErrorMessage,
    passwordError,
    passwordErrorMessage
  }
  
  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <div style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "relative"
      }}>
        <SignInContainer {...signInContainerProps} />
      </div>
    </AppTheme>
  );
}