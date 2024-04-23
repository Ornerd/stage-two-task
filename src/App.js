import React, { useState, useEffect } from 'react';
import MovieBox from './MovieBox';
import Card from './Card';
import Footer from './footer';
import './asset/css/App.css';
import SearchIcon from './asset/icons/search_icon.svg';
import Logo from './asset/icons/Logo.png';
import HamMenu from './asset/icons/Menu.svg';

const API_URL="https://api.themoviedb.org/3/movie/top_rated?api_key=befa3a6b18663094411ae9c1758fd3a6";  //for the top-rated movies, what actually matters.
const API_URLtwo="https://api.themoviedb.org/3/movie/popular?api_key=befa3a6b18663094411ae9c1758fd3a6"; //for popular movies




const App = () => {

    const [movies, setMovies] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [isActive, setIsActive] = useState(false); //the aim is to take out hero section once making a search

    var [SearchMovies, setSearchMovies] = useState(['']);

    useEffect(()=>{
        fetch(API_URL)
        .then((res)=>res.json())
        .then(data=>{
            console.log(data.results.slice(0,10))
            setMovies(data.results.slice(0,10))
        });
        fetch(API_URLtwo)
        .then((res)=>res.json())
        .then(data=>{
            console.log(data.results.slice(0,10))
            setFeatured(data.results.slice(0,5))
        })
    },[])


    async function SearchForMovies(e){
        e.preventDefault();
        console.log('searching')

        try{
            const url=`https://api.themoviedb.org/3/search/movie?api_key=befa3a6b18663094411ae9c1758fd3a6&query=${SearchMovies}`
            const res = await fetch (url);
            const data= await res.json();
            console.log(data);
            setMovies(data.results.slice(0,10)) 
                       
        }
        catch(e){
            console.log(e)
        }
    }

    const refreshPage= ()=>{
        window.location.reload();
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            SearchForMovies(e);
            HandleClick();
        }
      };

    function HandleClick() {
        setIsActive(true);
      };

    return (
        <div className="app">
           
            <nav>
                <img class="logo"
                    src={Logo}
                    alt="logo"
                    onClick={refreshPage}
                />

                <div className={isActive ? 'inverted' : 'search-bar'}>
                    <input
                        placeholder="What do you want to watch?"
                        value={SearchMovies}
                        onChange={(e)=> setSearchMovies(e.target.value)}
                        onSubmit= {function(e){{SearchForMovies(e);HandleClick()}}}
                        onKeyDown={handleKeyDown}
                    />
                    <img
                        src={SearchIcon}
                        alt="search"
                        onClick= {function(e){{SearchForMovies(e);HandleClick()}}}
                       
                        
                    />
                </div>

                

                <div className="to-right">
                    <h4>Sign in</h4>
                    <img
                        src={HamMenu}
                        alt="ham-menu"/>
                </div>
            </nav>
            
            <div className={isActive ? 'display-hidden' : 'featured'}>
                 {featured.map((featuredReqs)=><MovieBox key={featuredReqs.id}{...featuredReqs}/>)}
            </div>

            <div className="movie-list-header">
                <h1>Featured Movies</h1>
                <h4>See more</h4>
            </div>

            {
                movies?.length > 0
                    ? (
                        <div className="movie-list">                                                 
                            {movies.map((movieReqs)=><Card key={movieReqs.id}{...movieReqs}/>)}
                        </div>)
                    :(
                        <div> <h2>No Movies found</h2> </div>
                    )
            }

            <Footer/>

        </div>
      
    )
};

export default App;