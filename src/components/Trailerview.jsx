import React, { useEffect, useState } from 'react'
import YouTube from 'react-youtube';
import { useLoaderData, useNavigate } from 'react-router-dom'

export default function Trailerview() {

    const movieTrailer = useLoaderData()
    const navigate = useNavigate()
    const [officialTrailer, setOfficialTrailer] = useState(null)
    const [trailer, setTrailer] = useState([])

    const trailers = movieTrailer.movieVideo;

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
    },[])

  return (
    <section className='featured-trailer place-center'>
        <span className='cancel-button' onClick={()=> navigate(-1)}></span>
        {
        officialTrailer?
        (<YouTube videoId={officialTrailer.key} opts={{ width:'100%', height:'100%' }} />)
        :
        trailer.length > 0?
        (<YouTube videoId={trailer[0].key} opts={{ width:'100%', height:'100%' }} />)
        :
        (<div className='place-center' style={{width: "100%", height: "100%"}}>No trailer available</div>)
        }
    </section>
  )
}

export const MovieVideoLoader = async ({ params }) => {
    try {
      
      const res  = await fetch(`https://api.themoviedb.org/3/movie/${params.videoId}/videos?api_key=befa3a6b18663094411ae9c1758fd3a6`)
      const data = await res.json()
  
      const movieVideo = data.results;
   
      return { movieVideo };
  
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
  }

