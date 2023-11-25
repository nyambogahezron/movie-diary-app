import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  // FaAngleDoubleRight,
  // FaLock,
  // FaPlay,
  // FaSearch,
  // FaUserAlt,
} from 'react-icons/fa';
import links from './data';
import logo from '../../assets/logo.png';
import ProfileNav from './profileNav';

const Navbar = () => {
  const [showLinks, setShowLinks] = useState(false);
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);

  const toggleLinks = () => {
    setShowLinks(!showLinks);
  };

  const linkStyles = {
    height: showLinks
      ? `${linksRef.current.getBoundingClientRect().height}px`
      : '0px',
  };
  return (
    <nav>
      <div className='nav-center'>
        <div className='nav-header'>
          <img src={logo} className='logo' alt='logo' />
          <button className='nav-toggle' onClick={toggleLinks}>
            <FaBars />
          </button>
          <div className='sm-profileNav'>
            <ProfileNav />
          </div>
        </div>

        <div
          className='links-container'
          ref={linksContainerRef}
          style={linkStyles}
        >
          <ul className='links' ref={linksRef}>
            {links.map((link) => {
              const { id, url, text } = link;

              return (
                <>
                  <li key={id}>
                    <Link to={url}>{text}</Link>
                  </li>
                </>
              );
            })}
            <li className='sm-logout'>
              <Link href='#'>Logout</Link>
            </li>
          </ul>
        </div>
        <div className='lg-profileNav'>
          <ProfileNav />
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
