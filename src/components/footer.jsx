import React from 'react';


const Footer= () => {
    const thisDate = new Date()
    const thisYear= thisDate.getFullYear();
    return (
        <footer className='footer'>
            <div>
            <a href="#" class="fa fa-facebook"></a>
            <a href="#" class="fa fa-instagram"></a>
            <a href="#" class="fa fa-twitter"></a>
            <a href="#" class="fa fa-youtube"></a>
            </div>
            <div>
                <h5>Conditions of Use</h5>
                <h5>Privacy & Policy</h5>
                <h5>Press Room</h5>
            </div>
            <div className="the-end">
                <h5>@{thisYear} MovieBox by Orbytal</h5>
            </div>
        </footer>
    )
}

export default Footer;