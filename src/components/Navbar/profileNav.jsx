import { Link } from 'react-router-dom';

const ProfileNav = () => {
  return (
    <div className='user-profile'>
      <div className='user-name'>
        <div>Hello,</div>
        <Link to='/profile'>
          <div>user name</div>
        </Link>
      </div>
      <div className='logout'>
        <Link to='/login'>Login</Link>
      </div>
    </div>
  );
};
export default ProfileNav;
