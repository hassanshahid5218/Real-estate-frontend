import { useState } from "react"
import {supabase} from '../supabase'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
export default function createListing() {
   const { currentuser } = useSelector((state) => state.user);
   const [Files,setFiles]=useState([])
   const [uploading, setUploading] = useState(false);
   const [imageUploadError, setImageUploadError] = useState(false);
   const [Error,setError]=useState(false);
   const [Loading,setLoading]=useState(false);
  
   const [formData, setFormData] = useState({
    imageUrls: [],
    name:"",
    description:"",
    address:"",
    type:'rent',
    bedrooms:1,
    bathrooms:1,
    regularprice:0,
    discountprice:0,
    offer:false,
    parking:false,
    furnished:false
  });
  const navigate=useNavigate();
  console.log(formData)
  console.log(currentuser);
  const handlesubmit = async () => {
  if (Files.length > 0 && Files.length + formData.imageUrls.length < 7) {
    setUploading(true);
    setImageUploadError(false);

    try {
      const promises = Array.from(Files).map((file) => uploadToSupabase(file));
      const urls = await Promise.all(promises);

      setFormData({
        ...formData,
        imageUrls: formData.imageUrls.concat(urls),
      });

      setUploading(false);
    } catch (err) {
      console.log(err);
      setImageUploadError(err.message || "Upload failed");
      setUploading(false);
    }
  } else {
    setImageUploadError("You can only upload 6 images per listing");
    setUploading(false);
  }
};
const uploadToSupabase = async (file) => {
  try {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("uploaded_images") // your bucket name
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("uploaded_images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  } catch (error) {
    throw error;
  }
};
const handleRemoveImage = (index) => {
  setFormData({
    ...formData,
    imageUrls: formData.imageUrls.filter((_, i) => i !== index),
  });
};
const handlechange=(e)=>{
  if(e.target.id==='rent'||e.target.id==='sell'){
    setFormData({
      ...formData,
      type: e.target.id
    })
  }
  if(e.target.id==='parking'||e.target.id==='furnished'||e.target.id==='offer'){
      setFormData({
        ...formData,
        [e.target.id]:e.target.checked
      })
  }
  if(e.target.type==='number'||e.target.type==='text'||e.target.type==='textarea'){
    setFormData({
        ...formData,
        [e.target.id]: e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
      })
  }
}
const handleformsubmit=async (e)=>{
   e.preventDefault();
   try{
    console.log("Form data before submit:", formData);
    console.log("Current user:", currentuser);
    
    if(formData.imageUrls.length<1) return setError("You should upload one image")
    if(formData.discountprice>formData.regularprice) return setError("Discount price should be less then Regular price")  
    if (!currentuser) {
      setError('You must be logged in to create a listing');
      return;
    }
    const userRef = currentuser.id || currentuser._id;
    if(!userRef){
      setError('No user id available, please sign in again');
      return;
    }
    setLoading(true);
    setError(false);
    
    const requestData = {...formData, userRef: userRef};
    console.log("Request data:", requestData);
    
   const res=await fetch(`${import.meta.env.VITE_API_URL}/api/listing/create`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json'
    },
    credentials: 'include',
    body:JSON.stringify(requestData)
    })
    
    console.log("Response status:", res.status);
    console.log("Response ok:", res.ok);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.log("Error response text:", errorText);
      throw new Error(`Failed to create listing: ${res.status} ${res.statusText} - ${errorText}`);
    }
    
   const data = await res.json();
   console.log("Success response data:", data);
   setLoading(false)
   if(data.success===false){
    setError(data.message)
   }
   navigate(`/listing/${data._id}`)
  }
  catch(error){
    console.log("Catch error:", error);
    setError(error.message);
    setLoading(false)
  }
}

  return (
   <main className='p-3 max-w-4xl mx-auto'>
    <h1 className='text-3xl font-semibold text-center my-7'>Create Listing</h1>
    
    <form onSubmit={handleformsubmit} className='flex flex-col sm:flex-row gap-4'>
      <div className='flex flex-col gap-4 flex-1  ' >
        <input type='text' placeholder='Name' className='border border-black p-3 rounded-lg' id='name' maxLength='62' minLength='10' required onChange={handlechange} value={formData.name}/>
        <input type='text' placeholder='Description' className='border border-black p-3 rounded-lg' id='description'  required onChange={handlechange} value={formData.description}/>
        <input type='text' placeholder='Address' className='border border-black p-3 rounded-lg' id='address' required onChange={handlechange} value={formData.address}/>
      
      <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type='checkbox' id='sell' className='w-5' onChange={handlechange} checked={formData.type === 'sell'} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' onChange={handlechange} checked={formData.type === 'rent'} />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' onChange={handlechange} checked={formData.parking} />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' onChange={handlechange} checked={formData.furnished} />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' onChange={handlechange} checked={formData.offer}/>
              <span>Offer</span>
            </div>
          </div>
          <div className='flex flex-wrap gap-6'>
            <div className='flex items-center'> 
              <input type='number' id='bedrooms' min='1' max='20' required className='p-3 border border-gray-300 rounded-lg' onChange={handlechange} value={formData.bedrooms}/>
              <p>Beds</p>
            </div>
             <div className='flex items-center gap-2'> 
              <input type='number' id='bathrooms' min='1' max='20' required className='p-3 border border-gray-300 rounded-lg' onChange={handlechange} value={formData.bathrooms}/>
              <p>Bath</p>
            </div>
             <div className='flex items-center'> 
              <input type='number' id='regularprice' min='20000' max='200000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handlechange} value={formData.regularprice}/>
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                {formData.type === 'rent' && (
                  <span className='text-xs'>(pkr / month)</span>
                )}
              </div>  
            </div>
            {formData.offer && (
              <div className='flex items-center'> 
              <input type='number' id='discountprice' min='20000' max='200000000' required className='p-3 border border-gray-300 rounded-lg' onChange={handlechange} value={formData.discountprice}/>
              <div className='flex flex-col items-center'>
                <p>Discount Price</p>
                 {formData.type === 'rent' && (
                    <span className='text-xs'>(pkr / month)</span>
                  )}
              </div>
            </div>
            )}
             
          </div>
    </div>   
    <div className='flex flex-col flex-1 gap-4'>
      <p className='font-semibold'>Images:
        <span className='font-normal text-grey-600 ml-2'>The first image will be cover (max 6)</span>
      </p>
      <div className="flex gap-4">
        <input onChange={(e)=>{setFiles(e.target.files)}} className='p-3 border border-gray-300 w-full' type='file' id='images' accept='image/*' multiple/>
       <button
              type='button'
              disabled={uploading}
              onClick={handlesubmit}
              className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
       <p className='text-red-700 text-sm'>
            {imageUploadError && imageUploadError}
          </p>
      </div>
      {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div
                key={url}
                className='flex justify-between p-3 border items-center'
              >
                <img
                  src={url}
                  alt='listing image'
                  className='w-20 h-20 object-contain rounded-lg'
                />
                <button
                  type='button'
                  onClick={() => handleRemoveImage(index)}
                  className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
                >
                  Delete
                </button>
              </div>
            ))}
      <button disabled={Loading||uploading} className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>{Loading?"Creating...":"Create Listing"}</button>
       {Error && <p className='text-red-700 text-sm'>{Error}</p>}
       
    </div>   
    </form>
   </main>
  )
}
