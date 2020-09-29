import React from "react";
import "../css/listCocktailCards.css"
import SingleCocktailCard from "./SingleCocktailCard";


const ListCocktailCards = ({cocktails, favorites}) => {
    return(
        <div className='cards-list'>
                {cocktails &&
                cocktails.length > 0 &&
                cocktails.map((item, index) => {
                    return (
                            <SingleCocktailCard key={item.id} cocktail={item}/>
                    );
                })}
        </div>
    )
};
export default ListCocktailCards;
