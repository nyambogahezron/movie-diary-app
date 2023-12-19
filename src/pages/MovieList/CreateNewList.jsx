import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Alert } from '../../components/Alert';

const CreateNewList = () => {
  const [movieName, setmovieName] = useState('');
  const [MovieType, setMovieType] = useState('');
  const [totalSeries, setTotalSeries] = useState('');
  const [CurrentSeries, setCurrentSeries] = useState('');
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
    console.log(movieName, totalSeries, CurrentSeries, MovieType);
    {
      if (!movieName || !totalSeries || !CurrentSeries || !MovieType) {
        setAlertMsg('Please, All Field Are Required! ');
        setIsError('true');
        setShowAlert('true');
      }
    }
  };

  return (
    <main className='login'>
      <div className='title form-title'>Create New Movie</div>
      <div className={`error  ${showAlert ? 'show' : 'hidden'}`}>
        <Alert alertMsg={alertMsg} isError={isError} />
      </div>

      <form className='form login-form ' onSubmit={handleLoginSubmit}>
        <div className='form-row'>
          <label htmlFor='movieName' className='form-label'>
            Movie Name
          </label>
          <input
            type='text'
            className='form-input '
            value={movieName}
            onChange={(e) => setmovieName(e.target.value)}
            id='movieName'
          />
        </div>
        <div className='form-row'>
          <label htmlFor='MovieType' className='form-label'>
            Movie Type
          </label>
          <input
            type='text'
            className='form-input '
            value={MovieType}
            onChange={(e) => setMovieType(e.target.value)}
            id='MovieType'
          />
        </div>
        <div className='form-row'>
          <label htmlFor='totalSeries' className='form-label'>
            Total Series/Parts
          </label>
          <input
            type='number'
            className='form-input '
            value={totalSeries}
            onChange={(e) => setTotalSeries(e.target.value)}
            id='totalSeries'
          />
        </div>
        <div className='form-row'>
          <label htmlFor='CurrentSeries' className='form-label'>
            Current Series/Parts
          </label>
          <input
            type='number'
            className='form-input '
            value={CurrentSeries}
            onChange={(e) => setCurrentSeries(e.target.value)}
            id='CurrentSeries'
          />
        </div>
              <div className='form-row'>
          <label htmlFor='CurrentSeries' className='form-label'>
            Cover Image
          </label>
          <input
            type='file'
            className='form-input '
            id='CurrentSeries'
          />
        </div>

        <button type='submit' className='submit-btn btn btn-block'>
          Create 
        </button>
      </form>

    </main>
  );
};
export default CreateNewList;
