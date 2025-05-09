import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Film, Tv, Search, BarChart3, User, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const location = useLocation();

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen);
	};

	const isActive = (path: string) => {
		return location.pathname === path;
	};

	const navLinks = [
		{ path: '/', label: 'Dashboard', icon: <Film className='w-5 h-5 mr-2' /> },
		{
			path: '/search',
			label: 'Discover',
			icon: <Search className='w-5 h-5 mr-2' />,
		},
		{
			path: '/stats',
			label: 'Stats',
			icon: <BarChart3 className='w-5 h-5 mr-2' />,
		},
		{
			path: '/profile',
			label: 'Profile',
			icon: <User className='w-5 h-5 mr-2' />,
		},
	];

	return (
		<nav className='bg-gray-900 border-b border-gray-800 sticky top-0 z-50 shadow-lg'>
			<div className='container-custom'>
				<div className='flex items-center justify-between h-16'>
					<div className='flex items-center'>
						<Link to='/' className='flex items-center'>
							<Tv className='h-8 w-8 text-red-500' />
							<span className='ml-2 text-xl font-bold text-white'>
								Movie Diary
							</span>
						</Link>
					</div>

					{/* Desktop menu */}
					<div className='hidden md:block'>
						<div className='ml-10 flex items-center space-x-4'>
							{navLinks.map((link) => (
								<NavLink
									key={link.path}
									to={link.path}
									className={`flex items-center nav-link ${
										isActive(link.path)
											? 'nav-link-active'
											: 'nav-link-inactive'
									}`}
								>
									{link.icon}
									{link.label}
								</NavLink>
							))}
						</div>
					</div>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<button
							onClick={toggleMenu}
							className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
						>
							{isMenuOpen ? (
								<X className='block h-6 w-6' aria-hidden='true' />
							) : (
								<Menu className='block h-6 w-6' aria-hidden='true' />
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Mobile menu */}
			{isMenuOpen && (
				<div className='md:hidden'>
					<div className='px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-800'>
						{navLinks.map((link) => (
							<NavLink
								key={link.path}
								to={link.path}
								className={`flex items-center py-3 px-3 nav-link ${
									isActive(link.path) ? 'nav-link-active' : 'nav-link-inactive'
								}`}
								onClick={() => setIsMenuOpen(false)}
							>
								{link.icon}
								{link.label}
							</NavLink>
						))}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;
