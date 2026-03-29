import React from 'react'
import { Link } from 'react-router-dom'
import { FaBath, FaBed } from 'react-icons/fa'

export default function Listingitem({listing}) {
    console.log("Listing is : ",listing)
  return (
    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 w-full sm:w-[330px]'>
      <Link to={`/listing/${listing._id}`}>
        <img src={listing.imageUrls?.[0]} alt='listing cover' className='h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-transform duration-200' />
      </Link>
      <div className='p-3 flex flex-col gap-2 w-full'>
        <p className='text-lg font-semibold text-slate-700 truncate'>{listing.name}</p>
        <p className='text-sm text-gray-600 line-clamp-2'>{listing.description}</p>
        <p className='text-slate-700 font-semibold'>${listing.offer ? listing.discountprice.toLocaleString('en-US') : listing.regularprice.toLocaleString('en-US')}{listing.type === 'rent' && ' / month'}</p>
        <div className='text-slate-700 flex gap-4'>
          <div className='flex items-center gap-1'>
            <FaBed className='text-lg' />
            <span className='text-sm'>{listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}</span>
          </div>
          <div className='flex items-center gap-1'>
            <FaBath className='text-lg' />
            <span className='text-sm'>{listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
