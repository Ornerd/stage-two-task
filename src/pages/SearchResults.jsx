import React, { useEffect, useState } from 'react'
import Footer from '../components/footer'
import SearchIcon from '../asset/icons/search_icon copy.svg';
import Logo from '../asset/icons/Logo black.png'
import HamMenu from '../asset/icons/Menu.svg';
import '../asset/css/searchResults.css';
import { Link, useSearchParams } from 'react-router-dom';
import SearchResult from '../components/SearchResult'

const SearchResults = () => {
    
    const [searchParam, setSearchParam] = useSearchParams();

    const searchKeyword = searchParam.get("search")

    const API_URL_for_search = process.env.REACT_APP_API_URL_for_search

    const [movieKeyword, setMovieKeyword] = useState(searchKeyword)
    const [displayedKeyword, setDisplayedKeyword] = useState(searchKeyword) //for the 'search results for' area
    const [movieResults, setMovieResults] = useState([])


    const fetchSearchedMovie = async (query) => {
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
                setMovieResults(results.slice(0,12))
                // setMoviesSuggestionList([])
            })
            .catch(error => {
                console.error('Error fetching more movies:', error);
            });
        }
    }, [])

    async function SearchForMovies(){
        fetchSearchedMovie(movieKeyword)
        .then(results => {
            setMovieResults(results.slice(0,12)) 
            setDisplayedKeyword(movieKeyword) 
            // setMoviesSuggestionList([])
        })
        .catch(error => {
            console.error('Error fetching more movies:', error);
        });

    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            fetchSearchedMovie(movieKeyword)
            .then(results => {
                setMovieResults(results.slice(0,12))
                setDisplayedKeyword(movieKeyword) 
                // setMoviesSuggestionList([])
            })
            .catch(error => {
                console.error('Error fetching more movies:', error);
            });
        }
        setSearchParam({search: `${movieKeyword}`})
    };

  return (
    <main className='results-area'>
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
        {/* <div className='sugggested-word-container'>
            {SearchMovies? uniqueMovies.map((suggestions)=> <SuggestedWord key={suggestions.id} suggestions={suggestions} handleClick={handleSearch}/>): <div></div>}
        </div> */}
        </div>
        
                      

        <div className="to-right">
            <h4>Sign in</h4>
            <img
                src={HamMenu}
                alt="ham-menu"/>
        </div>

    </nav>

    <h1>Search results for <i>{displayedKeyword}</i></h1>

    <section>
        {
            movieResults?.length > 0?
            movieResults.map((movieResult)=> {
                return <SearchResult key={movieResult.id}{...movieResult}/>
            })
            :
            <h2>No results found.</h2> 
        }
    </section>

    <Footer/>
    </main>
  )
}

export default SearchResults
