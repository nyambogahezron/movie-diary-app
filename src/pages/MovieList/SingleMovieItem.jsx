import Navbar from '../../components/Navbar';
import { FaStarHalfAlt } from 'react-icons/fa';

const SingleListItem = () => {
  return (
    <section className='singleList' id='singleList'>
      <header>
        <Navbar />
      </header>
      <main>
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
        </div>
      </main>
    </section>
  );
};
export default SingleListItem;
