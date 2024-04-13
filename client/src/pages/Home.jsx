// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../Components/Listingitem';
import imageSrc from '../assets/house5.jpg' // Import your image
import 'typeface-roboto-slab';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
       console.log(error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div>
      {/* top */}
      <div className='flex flex-col lg:flex-row gap-28 pt-32 px-3 pd-5 max-w-6xl mx-auto'>
  <div className='flex flex-col lg:w-1/2 '>
    <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl font-custom '>
      Find your next <span className='text-slate-500'>perfect</span> place with ease
    </h1>
    <div className='text-gray-500 text-xs sm:text-sm mt-3 '>
      Movease is the best place to find your next perfect place to live. We have a wide range of properties for you to choose from.
    </div>
    <Link
      to={'/search'}
      className='text-xs sm:text-sm bg-slate-800 text-white font-bold py-4 px-5 rounded hover:bg-slate-600 mt-4 inline-block font-serif'
    >
      Let's get started...
    </Link>
  </div>
  <div className=' lg:mt-6  lg:w-1/2  lg:ml-auto '>
    <img src={imageSrc} alt='Your image' className='w-full lg:w-500 h-300' />
  </div>
</div>


      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-3xl font-semibold text-slate-600 font-custom '>Recent offers</h2>
              <Link className='text-1xl text-blue-800 hover:underline font-custom ' to={'/search?offer=true'}>Show more offers</Link>
            </div>
            <div className='flex flex-wrap gap-10'>
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-3xl font-semibold text-slate-600 font-custom'>Recent places for rent</h2>
              <Link className=' text-blue-800 hover:underline font-custom text-1xl' to={'/search?type=rent'}>Show more places for rent</Link>
            </div>
            <div className='flex flex-wrap gap-10'>
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-3xl font-semibold text-slate-600 font-custom '>Recent places for sale</h2>
              <Link className='text-1xl text-blue-800 hover:underline font-custom ' to={'/search?type=sale'}>Show more places for sale</Link>
            </div>
            <div className='flex flex-wrap gap-10'>
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
