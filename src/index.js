import React from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.js';
import MovieDetails from './pages/MovieDetails.jsx';

const ourDefaultRouter = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
    },
    {
      path: "/movie",
      element: <MovieDetails/>
    }
  ]);

// ReactDOM.render(<App/>, document.getElementById('root'))
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
    <React.StrictMode>
        <RouterProvider router={ourDefaultRouter} />
    </React.StrictMode>
);