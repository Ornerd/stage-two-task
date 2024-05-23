import React from 'react';
import { useState } from 'react';

import IMDBLogo from '../asset/icons/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE@ 1.png'
import { Link } from 'react-router-dom';

const API_IMG="https://image.tmdb.org/t/p/w500/"

const Card =({ id, poster_path, release_date, title, vote_average, genre_ids, genres })=>{

    var [isFav, setIsFav] = useState(false);

    const toggleFavourite =()=>{
        setIsFav(isFav=!isFav)
    }

        return (
            <div className="movie-card prevent-select">
                <button className={isFav?'favorite':'for-clicks'} onClick={toggleFavourite}>
                    <svg stroke="#ffffff" fill="#ffffff" stroke-width="0" viewBox="0 0 16 16" className="for-fav" height="20px" width="20px" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"></path>
                    </svg>
                </button>
                <Link to={`/${id}`}>
                <img data-testid="movie-poster" src={API_IMG+poster_path !=="https://image.tmdb.org/t/p/w500/null"? API_IMG+poster_path: 'https://via.placeholder.com/400x600'} alt={title}/>
                </Link>
                <div>
                    <h6 data-testid="movie-release-date">{release_date.split('-')[0]}</h6>
                    <Link to={`/${id}`}><h3 data-testid="movie-title">{title}</h3></Link>
                    <div>
                        <img src={IMDBLogo} alt='IMDB-logo'/>
                        <h6>{Math.round(vote_average * 10) +  "/100"}</h6>
                    </div>
                    <div>
                        {genre_ids.map((id, index) => {  //mapping corrected by chatGPT to include a return function
                            const genre = genres.find(g => g.id === id);
                            return genre ? index === genre_ids.length-1 ?<h6 key={genre.id}>{genre.name}</h6> : <h6 key={genre.id}>{genre.name},</h6> : null;  // the whole index === genre_ids.length-1 ? ish was mainly to add a comma in between genres, giving it a semblance to the figma design. ChatGPT didn't give me that idea I promise; ChatGPTs method infact was slightly longer....
                        })}
                    </div>
                    
                </div>
            </div>
            )
    }
    
export default Card;