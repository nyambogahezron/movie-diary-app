import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <div className='not-found-container'>
    <div className='NotFound-info'>
      <div className='status-code'>404</div>
      <div className='title'>PAGE NOT FOUND :)</div>
  <Link to='/' className='link-button btn'>
        Home
      </Link>

    </div>
      
    </div>
  );
};
export default NotFound;
