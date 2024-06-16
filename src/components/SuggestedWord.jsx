import React from 'react'

const SuggestedWord = ({suggestion, handleClick}) => {
  const handleClicking = ()=> {
    handleClick(suggestion)
  }

  return (
    <div className='suggested-word' onClick={handleClicking}>
      {suggestion.title}
    </div>
  )
}

export default SuggestedWord
