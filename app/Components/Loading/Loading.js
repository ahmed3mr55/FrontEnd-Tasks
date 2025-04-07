"use client";
import React from 'react'

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center  bg-black/50 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white border-opacity-70"></div>
  </div>
  )
}

export default Loading