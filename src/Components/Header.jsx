// import React, { useEffect, useState } from 'react'
// import {FaSearch} from 'react-icons/fa'
// import { Link ,useNavigate} from 'react-router-dom'
// import { useSelector } from 'react-redux'
// export default function Header() {
//   const Navigate=useNavigate();
//   const {currentuser}=useSelector(state=>state.user)
//   const [searchTerm,setSearchTerm]=useState("")
//   const handlesubmit=(e)=>{
//         e.preventDefault();
//         const urlParams=new URLSearchParams(window.location.search);
//         urlParams.set("searchTerm",searchTerm);
//         const searchQuery=urlParams.toString();
//         Navigate(`/search?${searchQuery}`)
//   }
//   useEffect(()=>{
//     const urlParams=new URLSearchParams(location.search);
//     const searchTermFromUrl=urlParams.get('searchTerm');
//     if(searchTermFromUrl){
//       setSearchTerm(searchTermFromUrl)
//     }
//   },[location.search]);
//   return (
//     <div>
//       <header className='bg-[#0f172a] text-white  shadow-md' >
//         <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
//         <Link to="/"  >
//         <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
//             <span className='text-slate-200'>Hassan</span>
//             <span className='text-slate-400'>Real Estate</span>
//         </h1>
//         </Link>
//         <form onSubmit={handlesubmit} className='bg-slate-100 p-3 text-black rounded-lg flex items-center w-24 sm:w-65'>
//           <input type='text' placeholder='Search here' className='bg-transparent focus:outline-none w-full' onChange={(e)=>setSearchTerm(e.target.value)} />
//           <button>
//           <FaSearch className='text-slate-500'/>
//           </button>
//         </form>
//         <ul className='flex gap-4'>
//          <Link to="/"><li className='hidden sm:inline text-slate-200 hover:underline'>Home</li></Link>
//           <Link to="/about"><li className='hidden sm:inline text-slate-200 hover:underline' >About</li></Link>
//           <Link to="/profile">{
//             currentuser?(<img src={currentuser.avatar} alt='profile' className='rounded-full h-8 w-8 object-cover'/>):(<li className='hidden sm:inline text-slate-700 hover:underline'>Sign in</li>)
//           }
//           </Link>
//         </ul>
//         </div>
//       </header>
//     </div>
//   )
// }
import React, { useEffect, useState } from 'react';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const { currentuser } = useSelector((state) => state.user);

  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    if (searchTerm) urlParams.set('searchTerm', searchTerm);
    navigate(`/search?${urlParams.toString()}`);
    setMenuOpen(false); // close menu on search
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-[#0f172a] text-white shadow-md">
      <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-3">

        {/* LOGO */}
        <Link to="/">
          <h1 className="font-bold text-lg sm:text-xl">
            <span className="text-slate-200">Hassan </span>
            <span className="text-slate-400">Real Estate</span>
          </h1>
        </Link>

        {/* SEARCH (Desktop) */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex items-center bg-slate-100 px-3 py-2 rounded-lg w-72"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none text-black w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>
            <FaSearch className="text-slate-500" />
          </button>
        </form>

        {/* DESKTOP NAV */}
        <ul className="hidden sm:flex items-center gap-6">
          <Link to="/">
            <li className="hover:underline">Home</li>
          </Link>
          <Link to="/about">
            <li className="hover:underline">About</li>
          </Link>
          <Link to="/profile">
            {currentuser ? (
              <img
                src={currentuser.avatar}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <li className="hover:underline">Sign in</li>
            )}
          </Link>
        </ul>

        {/* MOBILE MENU BUTTON */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-4 bg-[#0f172a]">

          {/* SEARCH (Mobile) */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center bg-slate-100 px-3 py-2 rounded-lg"
          >
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none text-black w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>
              <FaSearch className="text-slate-500" />
            </button>
          </form>

          {/* NAV LINKS */}
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <p className="hover:underline">Home</p>
          </Link>

          <Link to="/about" onClick={() => setMenuOpen(false)}>
            <p className="hover:underline">About</p>
          </Link>

          <Link to="/profile" onClick={() => setMenuOpen(false)}>
            {currentuser ? (
              <img
                src={currentuser.avatar}
                alt="profile"
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <p className="hover:underline">Sign in</p>
            )}
          </Link>
        </div>
      )}
    </header>
  );
}