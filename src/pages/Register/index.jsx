import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "../../components/Alert";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRegisterMutation } from "../../slices/usersApiSlice";
import { setCredentials } from "../../slices/authSlice";
import logo from "../../assets/logo.png";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [showAlert]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log(userName, password, confirmPassword, userEmail);

    if (!userName || !password || !confirmPassword || !userEmail) {
      toast.error("Please provide all fields");
    }
    if (password != confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ userName, userEmail, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
      } catch (err) {
        console.log(err);
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <main className='login'>
      <div className='logo'>
        <span className='logo'>
          <img src={logo} alt='logo' />
        </span>
      </div>
      <div className='form-wrapper'>
        <div className='title form-title'>Register</div>
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
          <Link to='/login'>
            <div className='nav-user-btn'>Login</div>
          </Link>
        </div>
      </div>
    </main>
  );
};
export default Register;
