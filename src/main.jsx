import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './assets/index.css'
import 'react-toastify/dist/ReactToastify.css'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import store from './store';
import {Provider} from 'react-redux';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import CreateNew from './pages/MovieList/CreateNewList';
import Favorite from './pages/Favorite';
import Profile from './pages/Profile';
import Help from './pages/Help';
import NotFound from './pages/utilities/NotFound';
import SingleListItem from './pages/MovieList/SingleMovieItem';
import PrivateRoute from './components/PrivateRoute.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/explore' element={<Explore />} />
      <Route path='/help' element={<Help />} />
      <Route path='*' element={<NotFound />} />

      <Route path='' element={<PrivateRoute />}>
        <Route index={true} path='/' element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/favorite' element={<Favorite />} />
        <Route path='/create-new-movie' element={<CreateNew />} />
        <Route path='/list-item' element={<SingleListItem />} />
      </Route>

    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
<Provider store={store} >
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
</ Provider>
);
