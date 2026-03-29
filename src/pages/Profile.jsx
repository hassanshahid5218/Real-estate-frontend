import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef,useState } from 'react'; 
import {supabase} from '../supabase'
import {updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure, deleteUserStart, deleteUserSuccessfull, signoutUserFailure, signoutUserStart, signoutUserSuccessfull} from '../redux/user/user slice';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
// import axios from "axios";
export default function Profile() {
  const {currentuser,loading,error}=useSelector(state=>state.user)
  // console.log("CURRENT USER:", currentuser);
  console.log("USER ID:", currentuser.id);
  console.log("USER _ID:", currentuser._id);
  const fileref=useRef(null);
  const [filePerc,setFilePerc]=useState(0);
  const [fileUploadError,setFileUploadError]=useState(false);
  const [formData,setFormdata]=useState({
    username:'',
    email:'',
    avatar:'',
    password:''
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [listingError,setlistingError]=useState(false);
  const [userListing,setuserListing]=useState([]);
  const dispatch=useDispatch();
  useEffect(() => {
    if (currentuser) {
      setFormdata({
        username: currentuser.username || '',
        email: currentuser.email || '',
        avatar: currentuser.avatar || '',
        password: ''
      });
    }
  }, [currentuser]);

  const handleFileUpload=async(file)=>{
    try{
       setFileUploadError(false);
       setFilePerc(0);
       const fileExt=file.name.split(".").pop();
       const fileName=`${currentuser._id}-${Date.now()}.${fileExt}`;
       setFilePerc(30);
       const {error}=await supabase.storage
       .from("avatars")
       .upload(fileName,file);
       if(error){
        setFileUploadError(true)
        return;
       }
       setFilePerc(70);
       const {data}=supabase.storage
       .from("avatars")
       .getPublicUrl(fileName);
       setFilePerc(100);
       setFormdata({
        ...formData,
        avatar:data.publicUrl,
       });
    }
    catch(err){
      setFileUploadError(true)
    }
  };
  const handlechange=(e)=>{
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  }
  // console.log
  const handlesubmit=async (e)=>{
   e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentuser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }
  const handleDeleteUser= async()=>{
    try{
      dispatch(deleteUserStart())
      const res=await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${currentuser._id}`,{
        method:'Delete',}

      );
      const data= await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(data.message))
      }
      dispatch(deleteUserSuccessfull(data))
    }
    catch(error){
       dispatch(deleteUserFailure(error.message))
    }
  }
 const handlesignout=async()=>{
   try{
    dispatch(signoutUserStart());
    const res= await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signout`,
      {method:'GET'}
    );
    const data=await res.json();
    if(data.success===false){
      dispatch(signoutUserFailure(data.message))
      return
    }
    dispatch(signoutUserSuccessfull(data))

   }
   catch(error){
     dispatch(signoutUserFailure(error.message))
   }
 }
 const handleShowListing = async () => {
  try {
    setlistingError(false);
    const userId = currentuser?._id;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listings/${userId}`, { credentials: 'include' });
    const data = await res.json();
    if (data.success === false) {
      setlistingError(true);
      return;
    }
    setuserListing(data.listings || data || []);
  } catch (err) {
    setlistingError(true);
  }
}
const hanlelistingDelete=async (listingid)=>{
  try{
     const res=await fetch(`${import.meta.env.VITE_API_URL}/api/listing/delete/${listingid}`,{
      method:'DELETE'
    }
    )
    const data=await res.json();
    if(data.success===false){
      console.log(data.message)
    }
    setuserListing((prev)=>prev.filter((listing)=>listing._id!==listingid));
  }
  catch(error){
    console.log(error.message)
  }
}
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handlesubmit} >
        <input type='file' ref={fileref} hidden accept='image/*' onChange={(e)=>{handleFileUpload(e.target.files[0])}}/>
        <img  onClick={()=>{fileref.current.click()}} src={formData.avatar||currentuser.avatar} alt='profile' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'/>
        <p>
          {fileUploadError?(
            <span className="text-red-700">
              Error Uploading image
            </span>
          ):filePerc>0&&filePerc<100?(
            <span className="text-slate-700">
              Uploading{filePerc}%
            </span>
          ):filePerc===100?(
            <span className="text-green-700">
              Image successfully uploaded!
            </span>
          ):("")

          }
        </p>
        <input onChange={handlechange} type='text' placeholder='Username' className='border p-3 rounded-lg' id='username' value={formData.username} />
        <input onChange={handlechange} type='email' placeholder='Email' className='border p-3 rounded-lg' id='email' value={formData.email} />
        <input onChange={handlechange} type='password' placeholder='Password' className='border p-3 rounded-lg' id='password' value={formData.password} />
        <button
          type='submit'
          disabled={loading}
          className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'
        > 
          {loading ? 'Loading...' : 'Update'}
        </button>
        <Link className='bg-green-700 text-white rounded-lg p-3 hover:opacity-95 uppercase text-center' to={'/create-listing'}>create listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handlesignout} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error : ''}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess ? 'User is updated successfully!' : ''}
      </p>
      <button onClick={handleShowListing} className="text-green-700 w-full hover:underline">Show Listing</button>
       <p className="text-red-700 mt-5">{listingError?"Error showing listing":" "}</p>
       {userListing && userListing.length > 0 && 
        <div className="flex flex-col gap-4">
          <h1 className='text-center mt-7 text-2xl font-semibold'>Your Listings</h1>
          {userListing.map((listing) => (
            <div key={listing._id || listing.id} className="border rounded-lg p-3 flex justify-between items-center gap-4">
              <Link to={`/listing/${listing._id || listing.id}`}>
                <img src={listing.imageUrls?.[0]} alt="Listing Cover" className="h-6 w-6 object-contain" />
              </Link>
              <Link to={`/listing/${listing._id || listing.id}`} className="text-slate-700 font-semibold hover:underline truncate flex-1">
                <p>{listing.name}</p>
              </Link>
              <div className='flex flex-col item-center'>
                <button onClick={()=>hanlelistingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
                <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
          }
    </div>

  )
}
