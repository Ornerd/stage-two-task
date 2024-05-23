import React, { useState } from 'react'

const GenreTag = ({genre, handleSelection, id}) => {
    const [selected, setSelected] = useState(false);

    const handleSelect = ()=> {
        setSelected(selected => !selected)
        handleSelection(id)
    }


  return (
    <span onClick={handleSelect} className={selected? 'selected prevent-select' : 'prevent-select'}>
      {genre.name}
    </span>
  )
}

export default GenreTag
