import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import TvShowDetails from './pages/TvShowDetails';
import Profile from './pages/Profile';
import Stats from './pages/Stats';
import { EntryProvider } from './context/EntryContext';

function App() {
	return (
		<EntryProvider>
			<div className='min-h-screen bg-gray-900 text-gray-100'>
				<Routes>
					<Route path='/' element={<Layout />}>
						<Route index element={<Dashboard />} />
						<Route path='search' element={<Search />} />
						<Route path='movie/:id' element={<MovieDetails />} />
						<Route path='tv/:id' element={<TvShowDetails />} />
						<Route path='profile' element={<Profile />} />
						<Route path='stats' element={<Stats />} />
					</Route>
				</Routes>
			</div>
		</EntryProvider>
	);
}

export default App;
