import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Logo from '../assets/logo.png'; // Import your logo file here

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        <Link to='/'>
          <div className="flex items-center">
            <img src={Logo} alt="Logo" className="h-15 w-12 mr-0" />
            <h1 className='font-bold sm:text-2xl lg:text-3xl flex flex-wrap font-custom text-xl'>
              <span className='text-slate-500'>Mov</span>
              <span className='text-slate-700'>Ease</span>
            </h1>
          </div>
        </Link>
        
        {/* Responsive search box */}
        <form onSubmit={handleSubmit} className='bg-slate-100 p-2 sm:p-3 rounded-lg flex items-center'>
  <input
    type='text'
    placeholder='Search...'
    className='bg-transparent focus:outline-none w-16 sm:w-32 font-custom text-sm sm:text-base'
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button className="sm:w-16 lg:w-24 flex items-center justify-end"> {/* Adjust the width as needed */}
    <FaSearch className='text-slate-600' />
  </button>
</form>

        
        {/* Responsive navigation */}
        
        <ul className='flex gap-2 sm:gap-4'>
          <Link to='/'>
            <li className=' sm:inline text-slate-700 hover:underline font-custom text-sm sm:text-lg'>
              Home
            </li>
          </Link>
          <Link to='/about'>
            <li className=' sm:inline text-slate-700 hover:underline font-custom text-sm sm:text-lg'>
              About
            </li>
          </Link>
          <Link to='/profile'>
            {currentUser ? (
              <img
                className='rounded-full h-6 w-6 object-cover'
                src={currentUser.avatar}
                alt='profile'
              />
            ) : (
              <li className=' text-slate-700 hover:underline font-custom text-sm sm:text-lg'>Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
}
