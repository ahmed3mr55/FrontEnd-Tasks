import React from 'react'
import Task from '../Task/Task'

const List = () => {
  return (
    <div className='lg:w-1/2 w-full flex flex-col gap-2 md:w-3/4 sm:w-4/5 xs:w-5/6'>
      <Task />
    </div>
  )
}

export default List
