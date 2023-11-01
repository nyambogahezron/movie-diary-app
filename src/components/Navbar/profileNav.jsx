const ProfileNav = () => {
  return (
    <div className='user-profile'>
      <div className="user-name">
      <div>Hello,</div>
        <a href=''>
          <div>user name</div>
        </a>
      </div>
      <div className='logout'>
        <a href='/'>Logout</a>
      </div>
    </div>
  );
};
export default ProfileNav;
