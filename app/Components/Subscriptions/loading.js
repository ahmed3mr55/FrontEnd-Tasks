import React from 'react'

const loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-70"></div>
  </div>
  )
}

export default loading