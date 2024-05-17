import React from 'react'
import { useLoaderData, useParams } from 'react-router-dom';

export default function MovieDetails() {

  const params = useParams();
  const movieInDetail = useLoaderData();

  return (
    <main>
      <aside></aside>
      <video></video>
      <div>{movieInDetail.title}</div>
      <div>{movieInDetail.overview}</div>
      <div>{movieInDetail.release_date}</div>
      <div></div>
    </main>
  )
}

export const MovieDetailsLoader = async ({ params }) => {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${params.movieId}?api_key=befa3a6b18663094411ae9c1758fd3a6`);
    const data = await response.json();
    return data;
  } catch (error) {
      console.error('Error fetching movies:', error);
      return [];
  }
}


