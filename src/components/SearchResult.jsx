import React from 'react'
import { Link } from 'react-router-dom';

const SearchResult = ({poster_path, title, release_date, overview, id, genre_ids , genres}) => {
  const API_IMG = process.env.REACT_APP_API_IMG;

  return (
    <section className='search-result'>
        <div>
          <Link to={`/${id}`}>
            <img data-testid="movie-poster" src={API_IMG+poster_path !=="https://image.tmdb.org/t/p/w500/null"? API_IMG+poster_path: 'https://via.placeholder.com/400x600'} alt={title}/>
          </Link>
        </div>
        <div>
          <Link to={`/${id}`}><h2>{title}</h2></Link>
          <h4>date released: <i>{release_date}</i> </h4>
          <span>
            {genre_ids.map((id) => {
              const genre = genres.find(g => g.id === id);
              return genre ? <h6 key={genre.id}>{genre.name}</h6> : null; 
            })}
          </span>
          
          <p>{overview}</p>
        </div>
    </section>
  )
}

export default SearchResult