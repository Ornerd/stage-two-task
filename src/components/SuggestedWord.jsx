import React from 'react'

const SuggestedWord = ({suggestions}) => {
  return (
    <div className='suggested-word'>
      {suggestions.title}
    </div>
  )
}

export default SuggestedWord
