import React, {useEffect, useState} from "react";
import '../css/searchCocktails.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faSpinner, faArrowsAltH, faSadCry, faChevronCircleUp} from "@fortawesome/free-solid-svg-icons";
import {baseUrl} from "../const";
import ListCocktailCards from "./ListCocktailCards";
import BackToTop from "react-back-to-top-button";



const SearchCocktails = () => {
    const [ingredients, setIngredients] = useState([]);
    const [autocomplete, setAutocomplete] = useState('');
    const [clickedSearch, setClickedSearch] = useState(false);
    const [cocktails, setCocktails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeDisplay, setActiveDisplay] = useState('not-active');

    const data = [];
    ingredients.filter(ingredient => ingredient.selected).forEach((item) => {
        data.push(item.id_ingredient);
    });

    const handleSelect = (ingredient) => {
        if(ingredient && ingredient.selected) {
            ingredient.selected = false;
        }else {
            ingredient.selected = true;
        }
        setIngredients([...ingredients]);
    };
    useEffect(() => {
        fetch(`${baseUrl}/api/ingredients`)
            .then((res) => res.json())
            .then((data) => {
                return data;
            })
            .then((data) => {
                data.forEach(item=>{
                    item.selected = false;
                })
                setIngredients(data);
            });
    }, []);

    const searchCocktails = () => {
        setClickedSearch(true);
        setIsLoading(true);
        setActiveDisplay('active');
        fetch(`${baseUrl}/api/findCocktails`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((data) => {
                return data;
            })
            .then((data) => {
                setCocktails(data);
                setIsLoading(false);
            });

    };

    return(
        <section id='search'>
            <div className='search container'>
                <div className="service-bottom">
                    <p>Simply add the ingredients you have at home and we'll show you the cocktails you can make.</p>
                  <div className="card-ingredients">
                    <div className="wrap">
                        <div className="logo">
                            <h1>Ingredients</h1>
                        </div>
                        <div className="input-group">
                            <div className="search-group">
                            <input type="text" className="input" placeholder='Search' onChange={(event) => setAutocomplete(event.target.value)}/>
                            <FontAwesomeIcon icon={faSearch} className='search-icon'/>
                        </div>
                            <ul className="ingredient-list">
                                {ingredients.length > 0 &&
                                ingredients
                                    .filter(ingredient => !ingredient.selected)
                                    .filter(({ingredient}) => ingredient.toLowerCase().indexOf(autocomplete.toLowerCase()) > -1)
                                    .map((item, index)=>{
                                    return(
                                        <li className="ingredient" key={item.id_ingredient} onClick={() => handleSelect(item)} >
                                            <img className='img-ingredient' src={`https://www.thecocktaildb.com/images/ingredients/${item.ingredient}-Small.png`} alt=""/>
                                            <h3>{item.ingredient}</h3>
                                        </li>
                                    )
                                })
                                }
                                {ingredients.length <= 0 &&
                                    <div className='spin'>
                                        <FontAwesomeIcon icon={faSpinner} spin size={"5x"} />
                                    </div>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                    <FontAwesomeIcon icon={faArrowsAltH} color='lightgray' size={"10x"} className='arrow-icon'/>
                    <div className="card-ingredients">
                        <div className="wrap">
                            <div className="logo">
                                <h1>Selected ingredients</h1>
                            </div>
                            <ul className="ingredient-list selected">
                                {ingredients.length > 0 &&
                                ingredients.filter(ingredient => ingredient.selected)
                                    .map((item, index)=>{
                                    if (item.selected){
                                        return(
                                            <li className="ingredient delete-ingredient" key={item.id_ingredient} onClick={() => handleSelect(item)}>
                                                <img className='img-ingredient' src={`https://www.thecocktaildb.com/images/ingredients/${item.ingredient}-Small.png`} alt=""/>
                                                <h3>{item.ingredient}</h3>
                                            </li>
                                        )
                                    }
                                })
                                }
                            </ul>
                            <a href="#found" type="button" className="search-button" onClick={()=>searchCocktails()}>Search for cocktails</a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="found" className={activeDisplay + 'container'}>
                {clickedSearch &&
                    <div>
                        {isLoading &&
                        <div className='spin'>
                            <FontAwesomeIcon icon={faSpinner} spin size={"5x"} />
                        </div>
                        }
                        {cocktails !== undefined && cocktails && cocktails.length > 0 &&
                            <div className='allCocktails'>
                                <h1 className='all-cocktails-title'><span>F</span>ound <span>c</span>ocktails</h1>
                                <ListCocktailCards cocktails={cocktails}/>
                                <BackToTop
                                    showOnScrollUp
                                    showAt={700}
                                    speed={1000}
                                    easing="easeInOutSine"
                                >
                                    <FontAwesomeIcon icon={faChevronCircleUp} color='#026670' size={"lg"}/>
                                </BackToTop>
                            </div>
                        }
                        {cocktails.length === 0 &&
                            <div className='nothing-found'>
                                <h1 className='all-cocktails-title'><span>N</span>othing <span>F</span>ound</h1>
                                <FontAwesomeIcon icon={faSadCry} size={"5x"} />
                            </div>
                        }
                    </div>
                }
            </div>
        </section>
    )
};
export default SearchCocktails;
