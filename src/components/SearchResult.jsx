import React from 'react'
import { Link } from 'react-router-dom';

const SearchResult = ({poster_path, title, release_date, overview, id}) => {
  const API_IMG = process.env.REACT_APP_API_IMG;

  return (
    <main>
        <div>
        <img data-testid="movie-poster" src={API_IMG+poster_path !=="https://image.tmdb.org/t/p/w500/null"? API_IMG+poster_path: 'https://via.placeholder.com/400x600'} alt={title}/>
        </div>
        <div>
            <Link to={`/${id}`}><h2>{title}</h2></Link>
            <h4>date released:{release_date} </h4>
            <h6></h6>
            <p>{overview}</p>
        </div>
    </main>
  )
}

export default SearchResult