// import React from 'react';
// import { current } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../Firebase';
import {
  updateUserStart, updateUserFailure,
  updateUserSuccess, deleteUserFailure,
  deleteUserStart, deleteUserSuccess,
  signOutUserFailure, signOutUserSuccess, signOutUserStart
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { Link } from "react-router-dom";
//firebase storage
// allow read; 
// allow write:if 
// request.resource.size<2 * 1024 * 1024 && 
// request.resource.contentType.matches('image/.*')
export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const dispatch = useDispatch();
  console.log(formData);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  console.log(formData);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,
        {
          method: 'POST',
          headers:
          {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
          credentials: 'include'

        });
      console.log(res);
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }


      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }

  };
  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,

        {
          method: 'DELETE',
          credentials: 'include'
        });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

    } catch (error) {
      dispatch(deleteUserFailure(error.message));

    }
  }
  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signout');
      const data = await res.json;
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
      dispatch(signOutUserFailure(data.message));
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      {/* Profile Section */}
      <div className='flex'></div>
      <div className='flex flex-col mt-5 p-3 max-w-lg border border-slate-10 rounded-md shadow-2xl mx-auto '>
        <h1 className='text-3xl  bg-slate-700 font-semibold text-slate-100 p-1 text-center my-5 font-custom'>Profile</h1>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3 font-custom'>
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type='file'
            ref={fileRef}
            hidden
            accept='image/*'
          />
          <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile"
            className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 font-custom' />
          <p className='text-sm self-center font-custom'>
            {fileUploadError ? (
              <span className='text-red-700'>
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className='text-slate-700 font-custom'>{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className='text-green-700 font-custom'>Image successfully uploaded!</span>
            ) : (
              ''
            )}
          </p>
          <input type="text" placeholder='username' id='username'
            defaultValue={currentUser.username}
            className='border p-3 rounded-lg font-custom'
            onChange={handleChange} />
          <input type="text" placeholder='email' id='email'
            defaultValue={currentUser.email} className='border p-3 rounded-lg font-custom'
            onChange={handleChange} />
          <input type="password" placeholder='password' id='password' onChange={handleChange}
            className='border p-3 rounded-lg  font-custom ' />
          <button disabled={loading} className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 font-custom'>
            {loading ? 'loading...' : 'Update'}</button>
          <Link className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95 font-custom' to={"/create-listing"}>
            Create Listing
          </Link>
        </form>
        <div className='flex justify-between mt-3'>
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer font-custom text-lg'> Delete account</span>
          <span onClick={handleSignOut} className='text-red-700 cursor-pointer font-custom text-lg'> Sign out</span>
        </div>
        <p className='text-red-700 mt-2'>{error ? error : ''}</p>
        <p className='text-green-700 mt-1'>{updateSuccess ? "User Updated Successfully" : ''}</p>
      </div>

      {/* Show Listings Section */}
      <div className='flex flex-col mt-2 p-1 max-w-lg border border-slate-700 rounded-md shadow-2xl  mx-auto'>
        <button className='text-white w-full font-custom text-xl border  bg-slate-700 hover:bg-slate-600  rounded-md p-2' onClick={handleShowListings}>Show Listings</button>
        <p className='text-red-700 mt-2 font-custom '>{showListingsError ? 'Error Showing Listings' : ''}</p>

        {/* User Listings */}
        {userListings && userListings.length > 0 && (
          <div className='flex flex-col gap-4'>
            <h1 className='text-center mt-4 text-2xl font-semibold font-custom text-slate-700'>Your Listings</h1>
            {userListings.map((listing) => (
              <div
                key={listing._id}
                className='border rounded-lg p-3 flex justify-between items-center gap-4  '
              >
                <Link to={`/listing/${listing._id}`}>
                  <img
                    src={listing.imageUrls[0]}
                    alt='listing cover'
                    className='h-16 w-16 object-contain'
                  />
                </Link>
                <Link
                  className='text-slate-700 font-semibold  hover:underline truncate flex-1 font-custom text-xl'
                  to={`/listing/${listing._id}`}
                >
                  <p>{listing.name}</p>
                </Link>

                <div className='flex flex-col item-center font-custom'>
                  <button onClick={() => handleListingDelete(listing._id)}

                    className='text-red-700 uppercase font-custom'
                  >
                    Delete
                  </button>
                  <Link to={`/update-listing/${listing._id}`}>

                    <button className='text-green-700 uppercase font-custom'>Edit</button>

                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

