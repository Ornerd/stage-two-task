import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MovieBox from './MovieBox';
import Card from './Card';
import Indicator from './Indicator';
import Footer from './footer';
import './asset/css/App.css';
import SearchIcon from './asset/icons/search_icon.svg';
import Logo from './asset/icons/Logo.png';
import HamMenu from './asset/icons/Menu.svg';
import Tag from './Tag.jsx';

// const API_URL="https://api.themoviedb.org/3/movie/top_rated?api_key=befa3a6b18663094411ae9c1758fd3a6";  //for the top-rated movies, what actually matters.
const API_URL="https://api.themoviedb.org/3/discover/movie?api_key=befa3a6b18663094411ae9c1758fd3a6"; //for popular movies, now changed to discover movies to allow for filtering by genre, and release date.
const API_URLtwo="https://api.themoviedb.org/3/genre/movie/list?api_key=befa3a6b18663094411ae9c1758fd3a6"; //for movie genres

const App = () => {
    const [movies, setMovies] = useState([]);
    // const [displayedAmount, setDisplayedAmount] = useState(12);
    const [featured, setFeatured] = useState([]);
    const [isActive, setIsActive] = useState(false); //the aim is to take out hero section once making a search
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState([])
 

    const refs = useRef();
    let timeOut = null;

    var [SearchMovies, setSearchMovies] = useState(['']);

    const fetchMovies = async (page) => {
        // console.log(`${API_URL}&with_genres=16&page=${page}`)
        fetch(`${API_URL}&with_genres=${selectedGenre.join(',')}&page=${page}`)
        try {
            const response = await fetch(`${API_URL}&with_genres=${selectedGenre.join(',')}&page=${page}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    }

    const showMoreMovies = () => {
        const nextPage = currentPage + 1;
        fetchMovies(nextPage)
            .then(results => {
                setMovies(prevMovies => [...prevMovies, ...results]);
                setCurrentPage(nextPage);
            })
            .catch(error => {
                console.error('Error fetching more movies:', error);
            });
    };

    useEffect(()=>{        
        fetchMovies(currentPage)
        .then(results => {
            setMovies(results);
        })
        .catch(error => {
            console.error('Error fetching initial movies:', error);
        });

        fetch(API_URL)
        .then((res)=>res.json())
        .then(data=>{
            console.log(data.results.slice(0,10))
            setFeatured(data.results.slice(0,5))
        })

        fetch(API_URLtwo)
        .then((res)=>res.json())
        .then(data=>{
            console.log(data.genres)
            setGenres(data.genres)
        })
    },[selectedGenre])


    async function SearchForMovies(e){
        e.preventDefault();
        console.log('searching')

        try{
            const url=`https://api.themoviedb.org/3/search/movie?api_key=befa3a6b18663094411ae9c1758fd3a6&query=${SearchMovies}`
            const res = await fetch (url);
            const data= await res.json();
            console.log(data);
            setMovies(data.results.slice(0,12)) 
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


    const showNext = () => {
        setCurrentIndex(currentIndex === featured.length - 1 ? 0 : currentIndex + 1)
    }  

    useEffect(()=> {
       timeOut = 
       setTimeout(()=>{
            showNext();

            function Animate() {
                refs.current.classList.add("current")
                setTimeout(()=> {
                    refs.current.classList.remove("current")  
                }, 1000)
            }

            Animate();

        }, 5000)
    })

  
    const handleToggle = (featIndex) => {
        setCurrentIndex(featIndex)
        clearTimeout(timeOut)
    }

    const handleSelectedGenre = (id) => {
        if(selectedGenre.includes(id)) {
            setSelectedGenre((prevIds)=> prevIds.filter(prevId => prevId != id))
        }else{
            setSelectedGenre((prevIds)=>[...prevIds, id])
        }
        
    }

  
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
                 {/* {featured.map((featuredReqs)=><MovieBox key={featuredReqs.id}{...featuredReqs}/>)} */}
                 <MovieBox key={featured[currentIndex]}{...featured[currentIndex]} refs={refs}/>

                 <aside>
                    {featured.map((featured, featIndex)=><Indicator key={featured[featIndex]} label = {featIndex + 1} handleToggle={handleToggle} slideIndex={featIndex} currentIndex={currentIndex}/>)}
                 </aside>
            </div>

            <div className="movie-list-header">
                <h1>Featured Movies</h1>
                <h3>Filter by Genre:</h3>
                <div className="for-genres">
                    {genres.map((genre)=> <Tag key={genre.id} genre={genre} handleSelection={handleSelectedGenre} id={genre.id}/>)}
                </div>
                
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

            <h4 className="see-more" onClick={()=>{showMoreMovies()}}>See more</h4>

            <Footer/>

        </div>
      
    )
};

export default App;