import React, { useEffect, useState } from 'react'
import { useLoaderData } from 'react-router-dom';
import YouTube from 'react-youtube';

export default function MovieDetails() {

  const movieInDetail = useLoaderData();
  const [officialTrailer, setOfficialTrailer] = useState(null)
  const [trailer, setTrailer] = useState([])
 

  const trailers = movieInDetail.movieVideo;

  const filteredTrailers = trailers.filter(
    (video) =>
      video.type === 'Trailer' &&
      video.site === 'YouTube'
  );  

  useEffect(()=> {
    filteredTrailers.forEach((video)=> {
      if(video.name.toLowerCase().includes('official trailer')) {
        setOfficialTrailer(video)
      }else if (video.name.toLowerCase().includes('trailer')) {
        setTrailer((prevs)=>[...prevs, video])
      }
    })
  },[movieInDetail])
      

  return (
    <main>
      <aside></aside>
        {
        officialTrailer?
          (<YouTube videoId={officialTrailer.key} opts={{ width: '100%' }} />)
        :
        trailer.length > 0?
          (<YouTube videoId={trailer[0].key} opts={{ width: '100%' }} />)
        :
        (<div>No trailer available</div>)
        }
      <div>
        <h3>{movieInDetail.movieData.title}</h3>
        <h3>{movieInDetail.movieData.release_date}</h3>
        <h3>adult content</h3>
        <span>genre</span>
        <span>vote average | vote_count</span>
      </div>
      <section>
        <div>
          <p>{movieInDetail.movieData.overview}</p>
          <div>
            <span>director<span>yenyenyen</span></span>
            <span>director<span>yenyenyen</span></span>
            <span>director<span>yenyenyen</span></span>
          </div>
        </div>
        <div>
          <button>extra sererenren</button>
          <button>extra sererenren</button>

          <div>
            <p>best movies blah blah </p>
          </div>
        </div>
        
      </section>
      
    </main>
  )
}

export const MovieDetailsLoader = async ({ params }) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}?api_key=befa3a6b18663094411ae9c1758fd3a6`);
    const movieData = await response.json();

    const res  = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}/videos?api_key=befa3a6b18663094411ae9c1758fd3a6`)
    const data = await res.json()

    const movieVideo = data.results;

    return {movieData, movieVideo};

  } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
  }
}


