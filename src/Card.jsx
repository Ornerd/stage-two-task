import React from 'react';
import { useState } from 'react';

import IMDBLogo from './asset/icons/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE@ 1.png'

const API_IMG="https://image.tmdb.org/t/p/w500/"

const Card =({ poster_path, release_date, title, vote_average })=>{

    var [isFav, setIsFav] = useState(false);

    const toggleFavourite =()=>{
        setIsFav(isFav=!isFav)
    }

        return (
            <div data-testid="movie-card" className="movie-card">
                <button className={isFav?'favorite':'for-clicks'} onClick={toggleFavourite}>
                    <svg stroke="#ffffff" fill="#ffffff" stroke-width="0" viewBox="0 0 16 16" className="for-fav" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
                    </svg>
                </button>
                <img data-testid="movie-poster" src={API_IMG+poster_path !=="https://image.tmdb.org/t/p/w500/null"? API_IMG+poster_path: 'https://via.placeholder.com/400x600'} alt={title}/>
                <div>
                    <h6 data-testid="movie-release-date">{release_date}</h6>
                    <h3 data-testid="movie-title">{title}</h3>
                    <div>
                        <img src={IMDBLogo} alt='IMDB-logo'/>
                        <h6>{Math.round(vote_average * 10) +  "/100"}</h6>
                    </div>
                    {/* <h4>{API_GENRE}</h4> */}
                </div>
                
            </div>
            )
    }
    
export default Card;