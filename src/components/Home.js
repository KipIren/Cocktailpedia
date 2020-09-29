import React, {useState, useEffect, useCallback} from "react";
import '../css/home.css';
import {baseUrl} from "../const";
import ListCocktailCards from "./ListCocktailCards";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {faChevronCircleUp} from "@fortawesome/free-solid-svg-icons";
import { useDebouncedCallback } from 'use-debounce';
import BackToTop from "react-back-to-top-button";

const pageLimit = 12;

const Home = () => {
    const [cocktails, setCocktails] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [number, setNumber] = useState(1);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isBottom, setBottom] = useState(false);


    useEffect(() => {
        fetch(`${baseUrl}/api/allCocktails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ number, limit: pageLimit }),
        })
            .then((res) => res.json())
            .then((data) => {
                setIsLoaded(true);
                setCocktails((currentCocktails)=>[...currentCocktails, ...data.data]);
                setTotalCount(data.totalCount);
            },(error) => {
                setIsLoaded(true);
                setError(error);
            });
        setBottom(false);
    }, [number]);


    const onScroll = useCallback(()=> {
        if ((window.innerHeight + window.scrollY + 10) >= document.body.offsetHeight) {
            setBottom(true);
            setNumber(number => number+1);
        }

    },[setBottom, setNumber]);

    const onScrollDebounced = useDebouncedCallback(onScroll, 200);
    useEffect(() => {
        window.addEventListener("scroll", onScrollDebounced.callback);
        if(cocktails.length === 577) window.removeEventListener("scroll", onScrollDebounced.callback);
        return () => {
            window.removeEventListener("scroll", onScrollDebounced.callback);
        }
    },[onScrollDebounced.callback, cocktails.length])

        return (
            <>
                <section id="hero">
                    <div className="hero container">
                        <div>
                            <h1>Simply add the ingredients you have at home and we'll show you the cocktails you can
                                make. <br/>
                                Register and we’ll save your ingredients list so you can come back to it at any time.
                            </h1>
                            <a href="#allCocktails" type="button" className="cta">Show all cocktails</a>
                        </div>
                    </div>
                </section>
                <section id='allCocktails' className='container'>
                    <div className='allCocktails'>
                        <h1 className='all-cocktails-title'><span>A</span>ll <span>c</span>ocktails</h1>
                        {cocktails !== undefined && totalCount > 0 && isLoaded &&
                            <><ListCocktailCards cocktails={cocktails}/>
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
                        {!isLoaded &&
                        <div className='spin'>
                            <FontAwesomeIcon icon={faSpinner} spin size={"9x"} />
                        </div>
                        }
                        {isBottom &&
                        <div className='spin'>
                            <FontAwesomeIcon icon={faSpinner} spin size={"9x"} />
                        </div>
                        }
                    </div>
                </section>
            </>
        )
};
export default Home;
