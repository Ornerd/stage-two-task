import React, { useEffect, useState } from 'react'
import { Link, NavLink, useLoaderData } from 'react-router-dom';
import YouTube from 'react-youtube';
import '../asset/css/movieDetails.css';
import Logo from '../asset/icons/Logo black.png';
import cutLogo from '../asset/icons/tv.png';
import Placeholder from '../asset/images/Rectangle 37.png';

export default function MovieDetails() {

  const movieInDetail = useLoaderData();
  const [officialTrailer, setOfficialTrailer] = useState(null)
  const [trailer, setTrailer] = useState([])
  const [windowSize, setWIndowSize] = useState(window.innerWidth)
  const [directors, setDirectors] = useState([])
  const [writers, setWriters] = useState([])
 

  const trailers = movieInDetail.movieVideo;

  const filteredTrailers = trailers.filter(
    (video) =>
      video.type === 'Trailer' &&
      video.site === 'YouTube'
    );  


  const formatRuntime = () => {
    const runtimeMinutes = movieInDetail.movieData.runtime
    if (runtimeMinutes >= 60) {
      const hours = Math.floor(runtimeMinutes / 60)
      const mins = runtimeMinutes % 60
      return `${hours}h ${mins}m`
    }else {
        return `${runtimeMinutes}m`
    }
  }
  const formattedRunTime = formatRuntime();


  useEffect(()=> {
    filteredTrailers.forEach((video)=> {
      if(video.name.toLowerCase().includes('official trailer')) {
        setOfficialTrailer(video)
      }else if (video.name.toLowerCase().includes('trailer')) {
        setTrailer((prevs)=>[...prevs, video])
      }
    })    
  },[movieInDetail])

  useEffect(()=> {
    movieInDetail.creditsData.crew.forEach(
      (crewMember)=> {
        if(crewMember.job === 'Director') {
            setDirectors((prev)=>[...prev].includes(crewMember)?[...prev]:[...prev, crewMember]);
        }
      }
    )  
    movieInDetail.creditsData.crew.forEach(
      (crewMember)=> {
        if(crewMember.job === 'Writer' || crewMember.job === 'Screenplay') {
            setWriters((prev)=>[...prev].includes(crewMember)?[...prev]:[...prev, crewMember]);
        }
      }
    )  

  }, [])


  useEffect(()=> {  

    const handleScreenResize= ()=> { //the lengths I go to get responsive layouts ehh! shoutout to ksforgeeks.org though for this idea
      setWIndowSize(window.innerWidth)
    }
    window.addEventListener('resize', handleScreenResize)
    return ()=> {
      window.removeEventListener('resize', handleScreenResize)
    }
  }, [])
      

  return (
    <main>

      <aside>
        <Link to={'/'}>
          {windowSize < 900? (<img className="logo" src={cutLogo} alt="logo"/>) : (<img class="logo" src={Logo} alt="logo"/>) }
        </Link>
        <NavLink>
          <i className="fa fa-home" aria-hidden="true"  style={windowSize < 900?{ fontSize:40, color:'black'}:{ color:'black'}}></i>
          <span>Home</span>
        </NavLink>
        <NavLink>
          <i className="fa fa-video-camera" aria-hidden="true" style={windowSize < 900?{ fontSize:40, color:'black'}:{ color:'black'}}></i>
          <span>Movies</span>
        </NavLink>
        <NavLink>
          <i className="fa fa-television" aria-hidden="true" style={windowSize < 900?{ fontSize:40, color:'black'}:{ color:'black'}}></i>
          <span>TV Series</span>
        </NavLink>
        <NavLink>
          <i className="fa fa-calendar" aria-hidden="true" style={windowSize < 900?{ fontSize:40, color:'black'}:{ color:'black'}}></i>
          <span>Upcoming</span>
        </NavLink>
        <NavLink>
          <i className="fa fa-sign-in" aria-hidden="true" style={windowSize < 900?{ fontSize:40, color:'black'}:{ color:'black'}}></i>
          <span>Log in</span>
        </NavLink>
      </aside>

      <section>
      <div className='video-wrapper'>
          {
          officialTrailer?
            (<YouTube videoId={officialTrailer.key} opts={{ width:'100%', height:'100%' }} />)
          :
          trailer.length > 0?
            (<YouTube videoId={trailer[0].key} opts={{ width:'100%', height:'100%' }} />)
          :
          (<div className='place-center' style={{width: "100%", height: "100%"}}>No trailer available</div>)
          }
        </div>
        
      <div className='title-bar'>
        <h3>{movieInDetail.movieData.title}</h3>
        <i className="fa fa-circle" aria-hidden="true" style={{fontSize: 7}} ></i>
        <h4>{movieInDetail.movieData.release_date.split('-')[0]}</h4>
        <i className="fa fa-circle" aria-hidden="true" style={{fontSize: 7}} ></i>
        <h4>{formattedRunTime}</h4>
        <span className='genre-container'>
          {movieInDetail.movieData.genres.map((genre)=> <h6 key={genre.id}>{genre.name}</h6>)}
        </span>
        <span>
          <i className="fa fa-star" aria-hidden="true" style={{ color:'yellow', paddingRight:10, paddingLeft:5 }}></i>{(movieInDetail.movieData.vote_average).toFixed(2)} | {movieInDetail.movieData.vote_count}
        </span>
      </div>

      <article>
        <div>
          <p>{movieInDetail.movieData.overview}</p>
          <div className='cast-and-crew'>
            <span>
              <span>{directors.length>1? "Directors: ": "Director: "}</span> {directors.map((director, index)=> index === directors.length-1? <span key={index} className='red-text'>{director.name}</span>:<span key={index} className='red-text'>{director.name}, </span>)}
            </span>
            <span>
              <span>{writers.length>1? "Writers: ": "Writer: "}</span>{writers.map((writer, index)=> index === writers.length-1? <span key={index} className='red-text'>{writer.name}</span>:<span key={index}className='red-text'>{writer.name}, </span>)}
            </span>
            <span>
              <span>Stars: </span>{movieInDetail.creditsData.cast.slice(0,3).map((cast, index)=> index === movieInDetail.creditsData.cast.slice(0,3).length-1 ? <span key={cast.id} className='red-text'>{cast.name}</span> : <span key={cast.id} className='red-text'>{cast.name}, </span>)}
            </span>
          </div>
        </div>
        <div className='unimportant'>
          <button><i className="fa fa-ticket" aria-hidden="true" style={{ color:'white', paddingRight:10, paddingLeft:5 }}></i>See Showtimes</button>
          <button><i className="fa fa-list" aria-hidden="true" style={{ color:'black', paddingRight:10, paddingLeft:5 }}></i>More Watch options</button>

          <div>
            <img src={Placeholder} alt="movie ads"/>
            <span><i className="fa fa-list" aria-hidden="true" style={{ color:'white', paddingRight:10, paddingLeft:5 }}></i><p>best movies and shows</p></span>
          </div>
        </div>
        
      </article>
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

    const creditResponse = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}/credits?api_key=befa3a6b18663094411ae9c1758fd3a6`)
    const creditsData = await creditResponse.json()

    const movieVideo = data.results;

    return {movieData, movieVideo, creditsData};

  } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
  }
}


