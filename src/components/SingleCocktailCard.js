import React, {useState, useContext, useEffect} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import '../css/singleCocktailCard.css';
import {UserContext} from "../context/UserContext";
import {baseUrl} from "../const";

const SingleCocktailCard = ({cocktail}) => {
    const [color, setColor] = useState('#333333');
    const [user, setUser] = useContext(UserContext);

    useEffect(() => {
        if(user.authenticated && user.favoritesCocktails.length > 0){
            user.favoritesCocktails.forEach((item) => {
                if (item.id === cocktail.id) {
                    setColor('crimson');
                }
            });
        }
    },[cocktail, user, setColor])

    const addRemoveToFavorites = () => {
        let status = '';
        if(color === 'crimson') {
            status = 'delete';
            setColor('#333333');
        }else {
            status = 'add';
            setColor('crimson');
        }

        if (user.authenticated) {
                 fetch(`${baseUrl}/api/favoritesRemoveAdd`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    cocktailId: cocktail.id,
                    user: user.id,
                    status: status,
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setUser({ ...user, favoritesCocktails: data });
                    return data;
                });
        }
    };
    return(
        <div className='card'>
            <div className="image-data">
                <img className="background-image" src={cocktail.img} alt='cocktail'/>
                <div className="details">
                    <div className='title-ingredients'>ingredients:</div>
                    <div className='ingredients'>
                        {cocktail.ingredients.map((item, index)=>{
                            return(
                                <p className='ingredient-item' key={index}>· {item}</p>
                                )
                        })
                        }
                    </div>
                </div>
            </div>
            <div className="post-data">
                <h1 className="title">{cocktail.name}</h1>
                <p className='description'>Instructions : {cocktail.instructions}</p>
            </div>
            {user.authenticated&&
            <div className='icon-container'>
                <FontAwesomeIcon icon={faHeart} className='icon-heart' style={{color: `${color}`}} onClick={()=>{addRemoveToFavorites();}}/>
            </div>
            }
        </div>
    )
};
export default SingleCocktailCard;
