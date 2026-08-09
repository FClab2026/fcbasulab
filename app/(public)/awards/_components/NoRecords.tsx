import React from 'react'

const NoRecords = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400 font-light">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-3-3v6m-7 4h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
        </svg>
        <p className="text-sm">No records found.</p>
    </div>
  )
}
      

export default NoRecords
