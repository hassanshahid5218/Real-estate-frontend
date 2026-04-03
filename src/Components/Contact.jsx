import  { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
export default function Contact({listing}) {
    const[landlord,setlandlord]=useState(null)
    const[message,setmessage]=useState("")
    console.log(listing)
    useEffect(()=>{
       const fetchlandlord= async()=>{
        try{
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/user/${listing.userRef}`, {
          credentials: 'include'
        })
        const data=await res.json();
        console.log("Data is : ",data);
        setlandlord(data);
        }
        catch(error){
           console.log(error)
        }
       
       };
        fetchlandlord();
    },[listing?.userRef])
    const handlechange=(e)=>{
        setmessage(e.target.value)
    }
    console.log("Landlord is ",landlord)
    // console.log("email is ",landlord.email)
  return (
    <div className='flex flex-col gap-2'>
      {landlord && (
        <div className=''>
          <p>
            Contact <span className='font-semibold'>{landlord.username}</span> for <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea name='message' id='message' rows='2' value={message} onChange={handlechange} placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg' ></textarea>
          <Link
                to={`mailto:${landlord.email}?subject=${encodeURIComponent(`Regarding ${listing?.name}`)}&body=${encodeURIComponent(message)}`}
                className='bg-slate-700 text-white p-3 uppercase rounded-lg hover:opacity-95 block text-center' target='blank'
         >
               Send Message
        </Link>
        </div>
      )}
    </div>
  )

}