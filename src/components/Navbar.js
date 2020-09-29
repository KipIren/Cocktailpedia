import React, {useCallback, useContext, useState} from "react";
import '../css/navbar.css';
import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";


const Navbar = () => {
    const [active, setActive] = useState(false);
    const [user, setUser] = useContext(UserContext);
    const handleClick = useCallback(() => {
        setActive(prevValue => !prevValue);
    }, [setActive]);
    const hamburgerClass = "hamburger" + (active ? " active" : "");
    const mobileMenuClass = active ? "active" : "";

    const singoutFunc = () => {
        setUser({authenticated:false,id:'',name:'',favoritesCocktails:[]});
    };

    return(
        <section id="header">
            <div className="header container">
                <div className="nav-bar">
                    <div className="brand">
                        <Link to='/'><h1><span>C</span>ocktail<span>p</span>edia</h1></Link>
                    </div>
                    <div className="nav-list">
                        <div className="hamburger-container">
                            <div className={hamburgerClass} onClick={handleClick}>
                                <div className="bar"></div>
                            </div>
                        </div>
                        <ul className={mobileMenuClass} onClick={handleClick}>
                            <li><Link to="/" data-after='Home'>Home</Link></li>
                            <li><Link to="/search" data-after='Search'>Search</Link></li>
                            <li><Link to="/favorites" data-after='Favorites'>Favorites</Link></li>
                            {user.authenticated &&
                                <li><a className='sing-out' onClick={()=> singoutFunc()}>Sing out</a></li>
                            }
                            {!user.authenticated &&
                                <li><Link to="/sing-in-out" data-after='Sing in'>Sing in</Link></li>
                            }
                        </ul>
                    </div>
                </div>
            </div>
        </section>
 )
};
export default Navbar;
