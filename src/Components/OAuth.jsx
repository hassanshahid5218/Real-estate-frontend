import {GoogleAuthProvider, signInWithPopup,getAuth} from 'firebase/auth'
import {app} from '../firebase'
import { useDispatch } from 'react-redux'
import { signinStart,signinSuccsess,signinfailure } from '../redux/user/user slice'
import { useNavigate } from 'react-router-dom'

export default function OAuth() {
    const dispatch=useDispatch();
    const navigate=useNavigate();
   const handlegoogleclick= async ()=>{
    try{
         const provider=new GoogleAuthProvider()
         provider.setCustomParameters({
         prompt: "select_account"
         })
         const auth=getAuth(app)
         const result= await signInWithPopup(auth,provider)
        //  console.log(result  )
        const res = await fetch('/api/auth/google', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL
        })
        });
        const data=await res.json();
        console.log(data)
        dispatch(signinSuccsess(data))
        navigate('/')

    }
    catch(error){
       console.log("Could not continue with google",error)
    }
   }

  return (
    <button type='button' onClick={handlegoogleclick} className='bg-red-700 text-white p-3 rounded-lg hover:opacity-95 uppercase'>Contine with google</button>
   
  )
}
