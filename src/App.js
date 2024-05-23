import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MovieBox from './components/MovieBox.jsx';
import Card from './components/Card.jsx';
import Indicator from './components/Indicator.jsx';
import Footer from './components/footer.jsx';
import './asset/css/App.css';
import SearchIcon from './asset/icons/search_icon.svg';
import Logo from './asset/icons/Logo.png';
import HamMenu from './asset/icons/Menu.svg';
import GenreTag from './components/GenreTag.jsx';
import SuggestedWord from './components/SuggestedWord.jsx';
import useDebounce from './hooks/useDebounce.jsx';
import YearTag from './components/YearTag.jsx';

const API_URL="https://api.themoviedb.org/3/discover/movie?api_key=befa3a6b18663094411ae9c1758fd3a6"; //formely popular movies endpoint was used, now changed to this discover movies endpoint to allow for filtering by genre, and probably release date.
const API_URLtwo="https://api.themoviedb.org/3/genre/movie/list?api_key=befa3a6b18663094411ae9c1758fd3a6"; //for movie genres
const API_URL_for_search="https://api.themoviedb.org/3/search/movie?api_key=befa3a6b18663094411ae9c1758fd3a6"

const App = () => {
    const [movies, setMovies] = useState([]);
    // const [displayedAmount, setDisplayedAmount] = useState(12);
    const [featured, setFeatured] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState([])
    const [releaseYear, setReleaseYear] = useState([])
    const [selectedReleaseYear, setSelectedReleaseYear] = useState(null)
 

    let timeOut = null;
    

    var [SearchMovies, setSearchMovies] = useState('');
    var [moviesSuggestionList, setMoviesSuggestionList] = useState([]);

    const debouncedSearchterm = useDebounce(SearchMovies, 500);
    const uniqueTitlesSet = new Set(); //helped by Chat GPT, to sort out suggested movie titles ensuring that one name desn't repeat twiCE

    
    const fetchMovies = async (page) => {
        // console.log(`${API_URL}&with_genres=16&page=${page}`)
        try {
            const response = await fetch(`${API_URL}&with_genres=${selectedGenre.join(',')}&page=${page}&primary_release_year=2008`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    }
    const fetchSearchedMovie = async (query) => {
        // console.log(`${API_URL}&with_genres=16&page=${page}`)
        try {
            const response = await fetch(`${API_URL_for_search}&query=${query}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    }

    useEffect(()=>{ 
        setMovies([])       
        fetchMovies(currentPage)
        .then(results => {
            setMovies(results);
        })
        .catch(error => {
            console.error('Error fetching initial movies:', error);
        });

        fetch(API_URL)  //for hero section
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

   
    useEffect(()=> {
        async function loadMovieSuggestions(){

            fetchSearchedMovie(debouncedSearchterm)
            .then(results => {
                setMoviesSuggestionList(results)
            })
            .catch(error => {
                console.error('Error fetching more movies:', error);
            });
              
        }

        if (debouncedSearchterm) {
            loadMovieSuggestions();
        }  
    }, [debouncedSearchterm])

    useEffect(()=> {
        const thisYearsDate = new Date()
        let thisYear = thisYearsDate.getFullYear()
        let yearsArray = []
    
        for (let i=0; i<15; i++) {
            yearsArray.push(thisYear)
            thisYear -= 1;
        }

        setReleaseYear(yearsArray);
    }, [])


    const handleSearch = async (suggestions) => {  //a little something I see on google. When a suggested word is clicked, the search bar acts on that word to produce results.          
        
        fetchSearchedMovie(suggestions.title)
        .then(results => {
            setMovies(results.slice(0,12)) 
            setMoviesSuggestionList([])
        })
        .catch(error => {
            console.error('Error fetching more movies:', error);
        });

    }  

    async function SearchForMovies(){

        fetchSearchedMovie(SearchMovies)
        .then(results => {
            setMovies(results.slice(0,12)) 
            setMoviesSuggestionList([])
        })
        .catch(error => {
            console.error('Error fetching more movies:', error);
        });

    }

    // Use filter to keep only unique movie titles while maintaining the order
    const uniqueMovies = moviesSuggestionList.filter(movie => {
        // Convert movie to lowercase for case-insensitive comparison
        const lowerCaseMovie = movie.title.toLowerCase();

        // Check if the lowercase movie title is already in the Set
        if (!uniqueTitlesSet.has(lowerCaseMovie)) {
            uniqueTitlesSet.add(lowerCaseMovie); // If not, add it to the Set
            return true; // Keep the movie title in the filtered array
        } else {
            return false; // Skip the duplicate movie title
        }
    }).slice(0,7);

   
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
        }
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

    const handleSelectedYear = () => {
        selectedReleaseYear.includes()?setReleaseYear(null) : selectedReleaseYear()
    }

    
  
    return (
        <div className="app">
           
            <nav>
                <img class="logo"
                    src={Logo}
                    alt="logo"
                    onClick={refreshPage}
                />

                <div className='search-container'>
                <form className='search-bar' role="search">
                    <input
                        placeholder="What do you want to watch?"
                        value={SearchMovies}
                        onChange={(e)=> {setSearchMovies(e.target.value)}}
                        onSubmit= {()=> {SearchForMovies()}}
                        onKeyDown={handleKeyDown}
                    />
                    <img
                        src={SearchIcon}
                        alt="search"
                        onClick= {()=> {SearchForMovies()}}                        
                    />
                </form>
                <div className='sugggested-word-container'>
                    {SearchMovies? uniqueMovies.map((suggestions)=> <SuggestedWord key={suggestions.id} suggestions={suggestions} handleClick={handleSearch}/>): <div></div>}
                </div>
                </div>
               
                             

                <div className="to-right">
                    <h4>Sign in</h4>
                    <img
                        src={HamMenu}
                        alt="ham-menu"/>
                </div>

            </nav>

            
            
            <div className='featured' onClick={()=> setMoviesSuggestionList([])}>
                 {featured.map((featuredMovie, index)=> {
                    if (index === currentIndex) {
                        return (<MovieBox key={featuredMovie.id}{...featuredMovie} currentIndex={currentIndex} index = {index}/>)
                    } else {
                        return (null)
                    }
                 }
                  )}

                 <aside>
                    {featured.map((featured, featIndex)=><Indicator key={featured[featIndex]} label = {featIndex + 1} handleToggle={handleToggle} slideIndex={featIndex} currentIndex={currentIndex}/>)}
                 </aside>
            </div>

            <div className="movie-list-header">
                <h1>Featured Movies</h1>
                <h2>Filter by:</h2>
                <h3>Genre:</h3>
                <div className="for-genres">
                    {genres.map((genre)=> <GenreTag key={genre.id} genre={genre} handleSelection={handleSelectedGenre} id={genre.id}/>)}
                </div>
                
                <div>
                    <label><h3>Year:</h3></label>
                    <select>
                    {releaseYear.map((year, index)=> <YearTag key={index} year={year}/>)}
                    </select>
                </div>
                
            </div>

            {
                movies?.length > 0
                    ? (
                        <div className="movie-list">                                                 
                            {movies.map((movie)=><Card genres={genres} key={movie.id}{...movie}/>)}
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