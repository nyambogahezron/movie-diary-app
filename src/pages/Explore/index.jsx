import Navbar from '../../components/Navbar';
import { FaHeart, FaStar, FaStarHalfAlt } from 'react-icons/fa';

const Explore = () => {
  return (
    <section>
      <header>
        <Navbar />
      </header>
      <main>
        <div className='home-container '>
          {/* <header className='home-header'>
            <div className='title'>My List</div>
            <div className='btn btn-add'>ADD NEW</div>
          </header> */}
          <article className='my-list'>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
            <div className='list-card'>
              <div className='list-card-img'>
                <img src='movie.jpeg' alt='' />
              </div>
              <div className='list-description'>
                <div className='list-card-title'>Wednesday</div>
                <div className='list-card-sn'>Sn 2/5</div>
                <div className='list-card-rate'>
                  {' '}
                  <FaStar /> <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStarHalfAlt />
                </div>
              </div>
              <div className='list-card-favorite'>
                <FaHeart className='FaHeart' />
              </div>
              <div className='list-card-favorite-active'>
                <FaHeart className='favorite-active' />
              </div>
            </div>
          </article>
        </div>
      </main>
    </section>
  );
};
export default Explore;
