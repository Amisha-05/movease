// eslint-disable-next-line no-unused-vars
import React from 'react'
import {useState}from 'react'
import{Link,useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import { signInFailure, signInStart,signInSuccess } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';

export default function SignIn() {

  const [formData,setFormData]=useState({});//keep track of all the data/changes that held in the input field
  const{error,loading}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const handleChange=(e)=>
  {
   
    setFormData(
      {
        ...formData,
        [e.target.id]:e.target.value,//uses spread operator  to create a new object that contains the existing formData and adds/updates a key-value pair.

      }
    );
  };

//ye abhi hmlg server ko bhej rhe hai post request aur /api/auth/signup ye point me server ko data mil jaayega 
  const handleSubmit= async (e)=>
  {
    e.preventDefault();//this will prevent from refreshing the page 
    try {
   dispatch(signInStart());
      const res= await fetch('/api/auth/signin',
  {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify(formData),
  }
);//we have created a proxy check vite.config.js
const data= await res.json();
console.log(data);//server will response
if(data.success === false)
{
  dispatch(signInFailure(data.message))
 
  return;
}
dispatch(signInSuccess(data));
navigate('/')
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };
  console.log(formData);
  return (
    <div className='p-3 max-w-lg mx-auto'>
    <h1 className='text-3xl text-center font-semibold'>SignIn</h1>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4 p-3'>
      
      <input type="email" placeholder='email'

      className='border p-3 rounded-lg' id='email'onChange={handleChange}  />
      <input type="password" placeholder='password'
      
      className='border p-3 rounded-lg' id='password'onChange={handleChange}  />
      <button disabled={loading}  className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
      { loading ? 'Loading...':'Sign IN'}</button>
      <OAuth/>
    </form>
    <div className='flex gap-2 mt-5'>
      <p>Dont have an account?</p>
      
<Link to ={"/sign-up"}>
  <span className='text-blue-700'>Sign up 
      </span>
     </Link>
    </div>
   { error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  )
}
