import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../components/Alert';

const Login = () => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState('');
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
    console.log(userName, password, rememberMe);
    {
      if (!userName || !password) {
        setAlertMsg('Please, All Field Are Required! ');
        setIsError('true');
        setShowAlert('true');
      }
    }
  };

  return (
    <main className='login'>
      <div className='title form-title'>Login</div>
      <div className={`error  ${showAlert ? 'show' : 'hidden'}`}>
        <Alert alertMsg={alertMsg} isError={isError} />
      </div>

      <form className='form login-form ' onSubmit={handleLoginSubmit}>
        <div className='form-row'>
          <label htmlFor='username' className='form-label'>
            Username/Email
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
        <div className='form-row' style={{ textAlign: 'left' }}>
          <input
            type='checkbox'
            checked={rememberMe}
            id='rememberMe'
            name='rememberMe'
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor='rememberMe'> Remember Me </label>
        </div>
        <button type='submit' className='submit-btn btn btn-block'>
          Login
        </button>
      </form>

      <div className='register-sec'>
        <div className='reg-txt'>
          <hr />
          {`Don't Have Account`} <hr />
        </div>
        <div className='nav-user-btn'>
          <Link to='/register'>Register</Link>
        </div>
      </div>
    </main>
  );
};
export default Login;
