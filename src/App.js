import React from 'react';
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import SearchCocktails from "./components/SearchCocktails";
import SingInOut from "./components/SingInOut";
import Favorites from "./components/Favorites";
import {UserProvider} from "./context/UserContext";

const App = () => {
  return (
        <Router>
            <UserProvider>
                <Navbar/>
                <Switch>
                    <Route exact path='/'> <Home/> </Route>
                    <Route path='/search'> <SearchCocktails/> </Route>
                    <Route path='/favorites'> <Favorites/> </Route>
                    <Route path='/sing-in-out'> <SingInOut/> </Route>
                </Switch>
            </UserProvider>
        </Router>
  );
}
export default App;


//TODO
//1.problems with endless scroll
