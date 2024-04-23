import React from 'react';


const Footer= () => {
    const thisDate = new Date()
    const thisYear= thisDate.getFullYear();
    return (
        <footer className='footer'>
            <div>
                
            </div>
            <div>
                <h5>Conditions of Use</h5>
                <h5>Privacy & Policy</h5>
                <h5>Press Room</h5>
            </div>
            <div>
                <h5>@{thisYear} MovieBox by Orbytal</h5>
            </div>
        </footer>
    )
}

export default Footer;