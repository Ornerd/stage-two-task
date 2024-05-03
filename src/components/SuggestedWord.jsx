import React from 'react'

const SuggestedWord = ({suggestions, handleClick}) => {
  const handleClicking = ()=> {
    handleClick(suggestions)
  }

  return (
    <div className='suggested-word' onClick={handleClicking}>
      {suggestions.title}
    </div>
  )
}

export default SuggestedWord
