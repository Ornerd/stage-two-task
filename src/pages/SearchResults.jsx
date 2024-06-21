import React, { useEffect, useState } from 'react'
import Footer from '../components/footer'
import SearchIcon from '../asset/icons/search_icon copy.svg';
import Logo from '../asset/icons/Logo black.png'
import HamMenu from '../asset/icons/Menu.svg';
import '../asset/css/searchResults.css';
import { Link, useSearchParams, useNavigation } from 'react-router-dom';
import SearchResult from '../components/SearchResult'
import SuggestedWord from '../components/SuggestedWord';
import useDebounce from '../hooks/useDebounce';

const SearchResults = () => {
    
    const [searchParam, setSearchParam] = useSearchParams();

    const searchKeyword = searchParam.get("search")

    const API_URL_for_search = process.env.REACT_APP_API_URL_for_search
    const API_URLtwo = process.env.REACT_APP_API_URLtwo

    const [movieKeyword, setMovieKeyword] = useState(searchKeyword)
    const [displayedKeyword, setDisplayedKeyword] = useState(searchKeyword) //for the 'search results for' area
    const [movieResults, setMovieResults] = useState([])
    const [displayedAmount, setDisplayedAmount] = useState(6)
    const [moviesSuggestionList, setMoviesSuggestionList] = useState([]);
    const [genres, setGenres] = useState([])
    const debouncedSearchterm = useDebounce(movieKeyword, 500);
    const [loading, setLoading] = useState(true)
    const uniqueTitlesSet = new Set();
    const navigationHook = useNavigation()


    const fetchSearchedMovie = async (query) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL_for_search}&query=${query}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        } finally {
            setLoading(false)
        }
    }

    const fetchSearchedMovieSuggestion = async (query) => {
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
        if (searchKeyword) {
            fetchSearchedMovie(movieKeyword)
            .then(results => {
                setMovieResults(results)
            })
            .catch(error => {
                console.error('Error fetching more movies:', error);
            });
        }

        fetch(API_URLtwo)
        .then((res)=>res.json())
        .then(data=>{
            console.log(data.genres)
            setGenres(data.genres)
        })

    }, [])

    async function SearchForMovies(){
        fetchSearchedMovie(movieKeyword)
        .then(results => {
            setMovieResults(results.slice(0,12)) 
            setDisplayedKeyword(movieKeyword) 
            setMoviesSuggestionList([])
        })
        .catch(error => {
            console.error('Error fetching more movies:', error);
        });
        setDisplayedAmount(6)
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchSearchedMovie(movieKeyword)
            .then(results => {
                setMovieResults(results)
                setDisplayedKeyword(movieKeyword) 
                setMoviesSuggestionList([])
            })
            .catch(error => {
                console.error('Error fetching more movies:', error);
            });
        }
        setSearchParam({search: `${movieKeyword}`})
        setDisplayedAmount(6)
    };

    useEffect(()=> {
        async function loadMovieSuggestions(){

            fetchSearchedMovieSuggestion(debouncedSearchterm)
            .then(results => {
                if(debouncedSearchterm !== searchKeyword) {
                    setMoviesSuggestionList(results)
                }
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
        if(movieKeyword === '') {
            setMoviesSuggestionList([])
        }
    }, [movieKeyword])

    function showMoreResults() {
        setDisplayedAmount((prev)=> prev + 6)
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

    const handleSearch = async (suggestion) => {  //a little something I see on google. When a suggested word is clicked, the search bar acts on that word to produce results.          
        
        // navigateTo(`/search?search=${suggestion.title}`)
        fetchSearchedMovie(suggestion.title)
        .then(results => {
            setMovieResults(results.slice(0,12)) 
            setMoviesSuggestionList([])
        })
        .catch(error => {
            console.error('Error fetching more movies:', error);
        });

    } 


  return (
    <main className={navigationHook.state === "loading"? "results-area no-interactions": "results-area"} onClick={()=> setMoviesSuggestionList([])}>

    <div className={navigationHook.state === "loading"? "loading": ""}></div>

      <nav>
        <Link to='/' style={{display:'flex', alignItems: 'center'}}>
        <img className="logo"
            src={Logo}
            alt="logo"
        />
        </Link>

        <div className='search-container inverted'>
        <form className='search-bar' role="search">
            <input
                placeholder="What do you want to watch?"
                value={movieKeyword}
                onChange={(e)=> {setMovieKeyword(e.target.value)}}
                onSubmit= {()=> {SearchForMovies(); setSearchParam({search: `${movieKeyword}`})}} 
                onKeyDown= {handleKeyDown}
            />
            <img
                src={SearchIcon}
                alt="search"
                onClick= {()=> {SearchForMovies(); setSearchParam({search: `${movieKeyword}`})}}                        
            />
        </form>
        <div className='sugggested-word-container'>
            {movieKeyword? uniqueMovies.map((suggestion)=> <SuggestedWord key={suggestion.id} suggestion={suggestion} handleClick={handleSearch}/>): <div></div>}
        </div>
        </div>
        
                      

        <div className="to-right">
            <h4>Sign in</h4>
            <img
                src={HamMenu}
                alt="ham-menu"/>
        </div>

    </nav>

    <h1>Search results for <i>{displayedKeyword}</i></h1>

    <section className='results-container'>
        {
            loading? 
            <div className='loading no-interactions'></div>
            :
            movieResults?.length > 0?
            movieResults.slice(0, displayedAmount).map((movieResult)=> {
                return <SearchResult genres={genres} key={movieResult.id}{...movieResult}/>
            })
            :
            <h2>No results found.</h2> 
        }

        <h4 className={displayedAmount > movieResults.length? "see-more no-interactions" :"see-more"} onClick={()=>{showMoreResults()}}>See more</h4>
    </section>

    <Footer/>
    </main>
  )
}

export default SearchResults
