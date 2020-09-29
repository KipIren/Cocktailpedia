import React,{useContext} from "react";
import '../css/favorites.css';
import {Link} from "react-router-dom";
import {UserContext} from "../context/UserContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronCircleUp, faSadCry} from "@fortawesome/free-solid-svg-icons";
import ListCocktailCards from "./ListCocktailCards";
import BackToTop from "react-back-to-top-button";

const Favorites = () => {
    const [user] = useContext(UserContext);
    return(
        <section id='favorites'>
            <div className='favorites container'>
                <div className="favorites">
                    <h1 className="favorites-title">Favor<span>i</span>tes</h1>
                    {!user.authenticated &&
                    <div className='nothing-found'>
                        <Link to="/sing-in-out">
                            <h1 className='all-cocktails-title toLogin'><span>P</span>lease <span>L</span>ogin</h1>
                        </Link>
                    </div>
                    }
                    {user.favoritesCocktails.length <= 0 && user.authenticated &&
                    <div className='nothing-found'>
                        <h1 className='all-cocktails-title'><span>N</span>othing <span>F</span>ound</h1>
                        <FontAwesomeIcon icon={faSadCry} size={"5x"} />
                    </div>
                    }
                    {user.authenticated && user.favoritesCocktails.length > 0 &&
                        <><ListCocktailCards cocktails={user.favoritesCocktails}/>
                            <BackToTop
                                showOnScrollUp
                                showAt={700}
                                speed={1000}
                                easing="easeInOutSine"
                            >
                                <FontAwesomeIcon icon={faChevronCircleUp} color='#026670' size={"lg"}/>
                            </BackToTop>
                        </>
                    }
                </div>
            </div>
        </section>
    )
};
export default Favorites;
