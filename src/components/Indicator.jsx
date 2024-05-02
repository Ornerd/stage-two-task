import React from 'react';


const Indicator = ({label, handleToggle, slideIndex, currentIndex}) => {

    const handleToggler = () => {
        handleToggle(slideIndex)
    }

    return (
        <div className={ label=== currentIndex + 1? "indicator active" : "indicator"} onClick={()=>handleToggler()}>
            <h3>{label}</h3>
            <span></span>
        </div>
    )
       
}

export default Indicator;