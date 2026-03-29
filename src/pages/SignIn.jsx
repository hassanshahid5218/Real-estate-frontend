import React, { useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { signinStart,signinSuccsess,signinfailure } from '../redux/user/user slice'
import OAuth from '../Components/OAuth'
export default function Signin() {
  const[formdata,setformdata]=useState({
    username:'',
    email:'',
    password:''
  })
  const {loading,error}=useSelector((state)=>state.user)
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const handlechange=(e)=>{
    setformdata({
      ...formdata,
      [e.target.id]:e.target.value,
    })
  } 

  const handlesubmit= async (e)=>{
    e.preventDefault();
    try{
    dispatch(signinStart());
    const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signin`,{
      method:'POST',
      headers:{
        'Content-Type': 'application/json',
      },      credentials:'include',      body:JSON.stringify(formdata)
    }
    );
    const data=await res.json();
    console.log(data);
    if(data.Success===false){
     dispatch(signinfailure(data.message))
      return;
    }
    dispatch(signinSuccsess(data))
    navigate('/')
  }
  catch(error){
     dispatch(signinfailure(error.message))
    }
  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>Sign In </h1>
      <form className='flex flex-col gap-4' onSubmit={handlesubmit}>
        <input type='email' placeholder='Enter Email' id='email' className='border p-3 rounded-lg' onChange={handlechange}/>
        <input type='password' placeholder='Enter Password' id='password' className='border p-3 rounded-lg' onChange={handlechange}/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-75 disabled:opacity-90' > {loading?'loading...':'Sign in'}</button>
        <OAuth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Dont Have an account</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p> }     

    </div>
  )
}
