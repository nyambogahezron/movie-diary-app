import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import CreateNew from './pages/MovieList/CreateNewList';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';
import Help from './pages/Help';
import NotFound from './pages/utilities/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/explore' element={<Explore />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/create-new-movie' element={<CreateNew />} />
        <Route path='/help' element={<Help />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};
export default App;
