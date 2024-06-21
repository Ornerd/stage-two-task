import React from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.js';
import MovieDetails, { MovieDetailsLoader } from './pages/MovieDetails.jsx';
import SearchResults from './pages/SearchResults.jsx';
import Trailerview, { MovieVideoLoader } from './components/Trailerview.jsx';

const ourDefaultRouter = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
        {
          path: "/:videoId",
          element: <Trailerview/>,
          loader: MovieVideoLoader,
        }
      ]
    },
    {
      path: "search",
      element: <SearchResults/>,
    },
    {
      path: "/:movieId",
      element: <MovieDetails/>,
      loader: MovieDetailsLoader,
    }
  ]);

// ReactDOM.render(<App/>, document.getElementById('root'))
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
    <React.StrictMode>
        <RouterProvider router={ourDefaultRouter} />
    </React.StrictMode>
);