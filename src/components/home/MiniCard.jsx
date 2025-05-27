import React from 'react'

const MiniCard = ({title,icon,number,footerNum}) => {
  return (
    <div className='bg-[#1a1a1a] py-3 px-5 rounded-lg w-[50%]'>
      <div className='flex items-start justify-between'>
        <h1 className='text-[#f5f5f5] text-lg font-semibold tracking-wide'>{title}</h1>
        <button className={`${title === "Total Earnings" ? "bg-[#02ca3a]" : "bg-[#f6b100]"} p-2 rounded-lg text-[#f5f5f5] text-1xl`}>{icon}</button>
      </div>
      <div>
        <h1 className='text-[#f5f5f5] text-3xl font-bold mt-2'>{title === "Total Earnings"  ? `₹${number}` : number}</h1>
        <h1 className='text-[#f5f5f5] text-lg mt-1'><span>{footerNum}%</span> than yesterday</h1>
      </div>
    </div>
  )
}

export default MiniCard
