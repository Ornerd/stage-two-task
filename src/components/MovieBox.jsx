import React, { useState } from 'react';
import IMDBLogo from '../asset/icons/MV5BMTk3ODA4Mjc0NF5BMl5BcG5nXkFtZTgwNDc1MzQ2OTE@ 1.png';
import { useNavigate } from 'react-router-dom';


const API_IMG="https://image.tmdb.org/t/p/w1280/";
// const API_GENRE="https://api.themoviedb.org/3/genre/movie/list?language=en";

const MovieBox =({backdrop_path, poster_path, title, vote_average, overview, id, currentIndex, index, refs})=>{
    const navigateTo = useNavigate()
   

    return (
        <div className={currentIndex === index?"featured-movie current prevent-select":"featured-movie"} ref={refs}>
            <img src={API_IMG+ `${window.innerWidth > window.innerHeight ? backdrop_path: poster_path}`} alt={title}></img>
            <div>
                <h1>{title}</h1>
                <span>
                    <img src={IMDBLogo} alt='IMDB-logo'/>
                    <h5>{Math.round(vote_average * 10) +  "/100"}</h5>
                </span>
                <h5>{overview}</h5>
                <button onClick={()=> navigateTo(`/${id}`) }>
                    <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16ZM7.5547 5.16795C7.24784 4.96338 6.8533 4.94431 6.52814 5.11833C6.20298 5.29235 6 5.63121 6 6V10C6 10.3688 6.20298 10.7077 6.52814 10.8817C6.8533 11.0557 7.24784 11.0366 7.5547 10.8321L10.5547 8.83205C10.8329 8.64659 11 8.33435 11 8C11 7.66565 10.8329 7.35342 10.5547 7.16795L7.5547 5.16795Z" fill="white"/>
                    </svg>
                    <h3>Watch Trailer</h3>
                </button>
            </div>
           
            {/* <h4>{API_GENRE}</h4> */}
        </div>
        )
}

export default MovieBox;