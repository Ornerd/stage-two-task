import React from 'react'
import Footer from '../components/footer'
import SearchIcon from '../asset/icons/search_icon copy.svg';
import Logo from '../asset/icons/Logo black.png'
import HamMenu from '../asset/icons/Menu.svg';
import '../asset/css/searchResults.css';
import { Link } from 'react-router-dom';

const SearchResults = () => {

    // const fetchSearchedMovie = async (query) => {
    //     // console.log(`${API_URL}&with_genres=16&page=${page}`)
    //     try {
    //         const response = await fetch(`${API_URL_for_search}&query=${query}`);
    //         const data = await response.json();
    //         return data.results;
    //     } catch (error) {
    //         console.error('Error fetching movies:', error);
    //         return [];
    //     }
    // }

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
                // value={SearchMovies}
                // onChange={(e)=> {setSearchMovies(e.target.value)}}
                // onSubmit= {()=> {SearchForMovies()}}
                // onKeyDown={handleKeyDown}
            />
            <img
                src={SearchIcon}
                alt="search"
                // onClick= {()=> {SearchForMovies()}}                        
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

    <h1>Search results for <i>Results</i></h1>

    <section>

    </section>

    <Footer/>
    </main>
  )
}

export default SearchResults
