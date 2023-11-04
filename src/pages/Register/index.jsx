import { useState, useEffect } from 'react';
import { Alert } from '../../components/Alert';

const Register = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isError, setIsError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log(userName, password, confirmPassword, userEmail);
    {
      if (!userName || !password || !confirmPassword || !userEmail) {
        setAlertMsg('Please, All Field Are Required! ');
        setIsError('true');
        setShowAlert('true');
      }
      if (password != confirmPassword) {
        setAlertMsg(`Password Entered Don't Match`);
        setIsError('true');
        setShowAlert('true');
      }
    }
  };

  return (
    <main className='login'>
      <div className='title form-title'>Register</div>
      <div className={`error  ${showAlert ? 'show' : 'hidden'}`}>
        <Alert alertMsg={alertMsg} isError={isError} />
      </div>

      <form className='form login-form ' onSubmit={handleLoginSubmit}>
        <div className='form-row'>
          <label htmlFor='username' className='form-label'>
            Username
          </label>
          <input
            type='text'
            className='form-input username-input'
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            id='userName'
          />
        </div>
        <div className='form-row'>
          <label htmlFor='userEmail' className='form-label'>
            Email
          </label>
          <input
            type='text'
            className='form-input username-input'
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            id='userEmail'
          />
        </div>
        <div className='form-row'>
          <label htmlFor='password' className='form-label'>
            Password
          </label>
          <input
            type='password'
            className='form-input password-input'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id='password'
          />
        </div>
        <div className='form-row'>
          <label htmlFor='confirmPassword' className='form-label'>
            Confirm Password
          </label>
          <input
            type='password'
            className='form-input password-input'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            id='confirmPassword'
          />
        </div>

        <button type='submit' className='submit-btn btn btn-block'>
          Register
        </button>
      </form>

      <div className='register-sec'>
        <div className='reg-txt'>
          <hr />
          {`Already Have An Account`} <hr />
        </div>
        <div className='nav-user-btn'>
          <a href=''>Login</a>
        </div>
      </div>
    </main>
  );
};
export default Register;
