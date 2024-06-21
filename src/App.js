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
import { Link, Outlet, useNavigate, useNavigation } from 'react-router-dom';


const App = () => {
    const [movies, setMovies] = useState([]);
    // const [displayedAmount, setDisplayedAmount] = useState(12);
    const [featured, setFeatured] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [genres, setGenres] = useState([])
    const [selectedGenre, setSelectedGenre] = useState([])
    const [releaseYear, setReleaseYear] = useState([])
    const [selectedReleaseYear, setSelectedReleaseYear] = useState()
    const [loading, setLoading] = useState(true)
    const navigationHook = useNavigation()
    const navigateTo = useNavigate()

    let timeOut = null;

    var [SearchMovies, setSearchMovies] = useState('');
    var [moviesSuggestionList, setMoviesSuggestionList] = useState([]);
    const debouncedSearchterm = useDebounce(SearchMovies, 500);
    const uniqueTitlesSet = new Set(); //helped by Chat GPT, to sort out suggested movie titles ensuring that one name desn't repeat twiCE

    
    const API_URL = process.env.REACT_APP_API_URL
    const API_URLtwo = process.env.REACT_APP_API_URLtwo
    const API_URL_for_search = process.env.REACT_APP_API_URL_for_search

    const fetchMovies = async (page) => {
        setLoading(true)
        try {
            const response = await fetch(`${API_URL}&with_genres=${selectedGenre.join(',')}&page=${page}&primary_release_year=${selectedReleaseYear}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        } finally{
            setLoading(false)
        }
    }
    const fetchMoreMovies = async (page) => {
        try {
            const response = await fetch(`${API_URL}&with_genres=${selectedGenre.join(',')}&page=${page}&primary_release_year=${selectedReleaseYear}`);
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error('Error fetching movies:', error);
            return [];
        }
    }

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

    useEffect(()=> {
        fetch(API_URL)  //for hero section
        .then((res)=>res.json())
        .then(data=>{
            setFeatured(data.results.slice(0,5))
        })
        fetchMovies(currentPage)
        .then(results => {
            setMovies(results);
        })
        .catch(error => {
            console.error('Error fetching initial movies:', error);
        })
    
    }, [])
    
    useEffect(()=> {
        fetchMovies(currentPage)
        .then(results => {
            setMovies(results); 
        })
        .catch(error => {
            console.error('Error fetching initial movies:', error);
        });
    }, [selectedGenre, selectedReleaseYear])

    useEffect(()=>{ 
        setMovies([]) 
        
        fetch(API_URLtwo)
        .then((res)=>res.json())
        .then(data=>{
            setGenres(data.genres)
        })

    },[selectedGenre, selectedReleaseYear])

   
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


    const handleSearch = /*async*/ (suggestion) => {  //a little something I see on google. When a suggested word is clicked, the search bar acts on that word to produce results.          
        navigateTo(`/search?search=${suggestion.title}`)
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
        fetchMoreMovies(nextPage)
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
            navigateTo(`/search?search=${SearchMovies}`)
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

    useEffect(()=>{  //little beginner way to reset year options anytime genre selection changes, giving the user the ability to choose desired releae year.
        setSelectedReleaseYear("select")
    }, [selectedGenre])

    
  
    return (
        <div className={navigationHook.state === "loading"? "app no-interactions": "app"}>

            <div className={navigationHook.state === "loading"? "loading": ""}></div>
           
            <nav>
                <img className="logo"
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
                        // onSubmit= {()=> {navigateTo(`/search?search=${SearchMovies}`)}}
                        onKeyDown={handleKeyDown}
                    />
                    <Link to={`/search?search=${SearchMovies}`}>
                    <img
                        src={SearchIcon}
                        alt="searchIcon"                                             
                    />
                    </Link>
                    
                </form>
                <div className='sugggested-word-container'>
                    {SearchMovies? uniqueMovies.map((suggestion)=> <SuggestedWord key={suggestion.id} suggestion={suggestion} handleClick={handleSearch}/>): <div></div>}
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
                    {featured.map((featured, featIndex)=><Indicator key={featIndex} label = {featIndex + 1} handleToggle={handleToggle} slideIndex={featIndex} currentIndex={currentIndex}/>)}
                 </aside>

                 <Outlet/>
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
                    <select value={selectedReleaseYear} onChange={(e)=> {setSelectedReleaseYear(e.target.value)}}>
                    <option value="select" selected disabled>Select year</option>
                    {releaseYear.map((year, index)=> <YearTag key={index} year={year}/>)}
                    </select>
                </div>
                
            </div>

            {   loading? 
                <div className='loading no-interactions'></div>
                :
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