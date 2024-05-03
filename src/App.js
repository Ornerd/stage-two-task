import React, { useState, useEffect, useRef } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MovieBox from './components/MovieBox.jsx';
import Card from './components/Card.jsx';
import Indicator from './components/Indicator.jsx';
import Footer from './components/footer.jsx';
import './asset/css/App.css';
import SearchIcon from './asset/icons/search_icon.svg';
import Logo from './asset/icons/Logo.png';
import HamMenu from './asset/icons/Menu.svg';
import Tag from './components/Tag.jsx';
import SuggestedWord from './components/SuggestedWord.jsx';
import useDebounce from './hooks/useDebounce.jsx';

// const API_URL="https://api.themoviedb.org/3/movie/top_rated?api_key=befa3a6b18663094411ae9c1758fd3a6";  //for the top-rated movies, what actually matters.
const API_URL="https://api.themoviedb.org/3/discover/movie?api_key=befa3a6b18663094411ae9c1758fd3a6"; //for popular movies, now changed to discover movies to allow for filtering by genre, and probably release date.
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
    

    var [SearchMovies, setSearchMovies] = useState('');
    var [moviesSuggestionList, setMoviesSuggestionList] = useState([]);

    const debouncedSearchterm = useDebounce(SearchMovies, 500);

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


    },[selectedGenre, currentPage])


    const handleSearch = async (suggestions) => {  //a little something I see on google. When a suggested word is clicked, the search bar acts on that word to produce results.          
        
        try{
            const url=`https://api.themoviedb.org/3/search/movie?api_key=befa3a6b18663094411ae9c1758fd3a6&query=${suggestions.title}`
            const res = await fetch (url);
            const data= await res.json();
            setMovies(data.results.slice(0,12)) 
            // setSearchMovies('')
            setMoviesSuggestionList([])

            
        }
        catch(e){
            console.log(e)
        }
    }  

    async function SearchForMovies(e){
        console.log('searching', e)

        try{
            const url=`https://api.themoviedb.org/3/search/movie?api_key=befa3a6b18663094411ae9c1758fd3a6&query=${SearchMovies}`
            const res = await fetch (url);
            const data= await res.json();
            setMovies(data.results.slice(0,12)) 
            // setSearchMovies('')
            setMoviesSuggestionList([])
        }
        catch(e){
            console.log(e)
        }
    }

   
    useEffect(()=> {
        async function loadMovieSuggestions(e){
            console.log('searching', e)
            
            try{
                const url=`https://api.themoviedb.org/3/search/movie?api_key=befa3a6b18663094411ae9c1758fd3a6&query=${debouncedSearchterm}`
                const res = await fetch (url);
                const data = await res.json();
    
                setMoviesSuggestionList(data.results.slice(0,7))

            }
            catch(e){
                console.log(e)
            }            
        }

        if (debouncedSearchterm) {
            loadMovieSuggestions();
        }  
    }, [debouncedSearchterm])

    useEffect(()=> {
        if(SearchMovies === '') {
            setMoviesSuggestionList([])
        }
    }, [SearchMovies])


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
        }, 5000)
    })

  
  
    const handleToggle = (featIndex) => {
        setCurrentIndex(featIndex)
        clearTimeout(timeOut)
    }

    const handleSelectedGenre = (id) => {
         setCurrentPage(1)  // setCurrentPage(1) is a little fix to reset page number of API results back to page 1 when new genres are added or removed, so that new filters can begin from the very top, all the time.
        if(selectedGenre.includes(id)) {
            setSelectedGenre((prevIds)=> prevIds.filter(prevId => prevId !== id))
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
                        onChange={(e)=> {setSearchMovies(e.target.value)}}
                        onSubmit= {(e)=> {{SearchForMovies(e);HandleClick()}}}
                        onKeyDown={handleKeyDown}
                    />
                    <img
                        src={SearchIcon}
                        alt="search"
                        onClick= {(e)=> {{SearchForMovies(e);HandleClick()}}}                        
                    />
                </div>
                             

                <div className="to-right">
                    <h4>Sign in</h4>
                    <img
                        src={HamMenu}
                        alt="ham-menu"/>
                </div>
            </nav>

            <div className='sugggested-word-container'>
                    {SearchMovies? moviesSuggestionList.map((suggestions)=> <SuggestedWord key={suggestions.id} suggestions={suggestions} handleClick={handleSearch}/>): <div></div>}
                </div>
            
            <div className={isActive ? 'display-hidden' : 'featured'} onClick={()=> setMoviesSuggestionList([])}>
                 {featured.map((featuredReqs, index)=> {
                    if (index === currentIndex) {
                        return (<MovieBox key={index}{...featuredReqs} currentIndex={currentIndex} index = {index}/>)
                    } else {
                        return (null)
                    }
                 }
                  )}
                 {/* <MovieBox key={featured[currentIndex]}{...featured[currentIndex]} refs={refs}/> */}

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