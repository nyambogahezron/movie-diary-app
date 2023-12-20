import Navbar from '../../components/Navbar';
import {
  FaPlus,
  FaStarHalfAlt,
  FaSearch,
  FaExternalLinkAlt,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className='home' id='home'>
      <header>
        <Navbar />
      </header>
      <main>
        <div className='home-header'>
          <form className='movie-search-list'>
            <input type='search' name='listSearch' placeholder='Search' />
            <div className='search-btn btn'>
              {' '}
              <FaSearch />{' '}
            </div>
          </form>
        </div>
        <div className='movie-list-container'>
          <div className='list-group'>
            <div className='list-group-item'>movie name</div>
            <div className='movie-type list-group-item'>movie type</div>
          </div>
          <div className='list-group'>
            <div className='current-sn list-group-item'>sn 2 of sn 4</div>
            <div className='movie-ratings list-group-item'>
              <FaStarHalfAlt />
            </div>
          </div>
          <div className='movie-list-action'>
            <Link to='/list-item'>
              <FaExternalLinkAlt />
            </Link>
          </div>
        </div>

        <div className='add-btn'>
          <Link to='/create-new-movie'>
            {' '}
            <FaPlus />{' '}
          </Link>
        </div>
      </main>
    </section>
  );
};
export default Home;
