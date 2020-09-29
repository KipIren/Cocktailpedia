const express = require("express");
const app = express();
const knex = require("knex");
const path = require('path');
const cors = require("cors");
const bp = require("body-parser");


app.use(cors());
app.use(bp.json());

app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(
    cors({
      credentials: true,
      origin: ["http://localhost:3000"],
      optionsSuccessStatus: 200
    })
);

const PORT = process.env.PORTF || 8081;
const DATABASE_USER = process.env.DATABASE_USER || 'postgres';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "PLACEHOLDER";

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: "cocktails",
  },
});



async function cocktailsByPage(pageNumber, limit){
  return db("cocktails")
      .select("*")
      .orderBy("drink_name")
      .offset((pageNumber - 1) * limit)
      .limit(limit);
}

async function totalCocktailsCount() {
  return db("cocktails").max("id").first();
}

async function deleteFavorite(id, cocktail_id) {
  return db("favorites_cocktails")
    .where({
      user_id: id,
      cocktail_id: cocktail_id,
    })
    .del();
}
async function putFavorite(user_id, cocktail_id) {
  return db("favorites_cocktails").insert([
    { user_id: user_id, cocktail_id: cocktail_id },
  ]);
}
async function getAllFavoritesByUserId(id) {
  return db("favorites_cocktails").select("cocktail_id").where("user_id", id);
}
async function getIngredients() {
  return db("ingredients").select("id_ingredient", "ingredient");
}

async function getRecipes() {
  return db("cocktail_ingredients").select("id_cocktail", "id_ingredient");
}

async function getCocktail(id) {
  return db("cocktails")
    .select("drink_name", "drink_img", "instructions")
    .where("cocktail_id", id);
}

async function getAllCocktails() {
  return db("cocktails").select("*");
}

async function getIngredientByRecepie(id) {
  return db("cocktail_ingredients")
    .select("id_ingredient")
    .where("id_cocktail", id);
}

async function getIngredientsNames(id) {
  return db("ingredients").select("ingredient").where("id_ingredient", id);
}

const allInfo = async (allCocktails) => {
  const result = [];
  for (let item = 0; item < allCocktails.length; item++) {
    const obj = {
      id: "",
      name: "",
      img: "",
      instructions: "",
      ingredients: [],
    };

    let ingredients = [];

    await getIngredientByRecepie(allCocktails[item].cocktail_id).then(
        (rees) => {
          rees.forEach(async (i) => {
            const ids = i.id_ingredient;
            const [ingr] = await getIngredientsNames(ids);
            ingredients.push(ingr.ingredient);
            obj.ingredients = ingredients;
          });
        }
    );

    await getCocktail(allCocktails[item].cocktail_id).then((ress) => {
      const [data] = ress;
      obj.id = allCocktails[item].cocktail_id;
      obj.name = data.drink_name;
      obj.img = data.drink_img;
      obj.instructions = data.instructions;
      result.push(Object.assign({}, obj));
    });
  }

  return result;
};


app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

app.get("/api/ingredients", async (req, res) => {
  let dbResponse = await getIngredients();
  res.send(dbResponse);
});

app.post("/api/favoritesRemoveAdd", async (req, res) => {
  let user = req.body;
  console.log(user);

  if (user.status == "add") {
    let result = await putFavorite(user.user, user.cocktailId);
  } else if (user.status == "delete") {
    let result = await deleteFavorite(user.user, user.cocktailId);
  }
  let allCocktails = await getAllFavoritesByUserId(user.user);
  console.log(allCocktails, "ALL");


  allInfo(allCocktails).then((data) => res.send(data));
});
app.post("/api/favorites", async (req, res) => {
  let user_id = req.body.id;
  console.log(user_id, "userId");

  let allCocktails = await getAllFavoritesByUserId(user_id);
  console.log(allCocktails, "allCocktails");


  if (allCocktails.length == 0) {
    res.send([]);
  } else {
    let cocktails = allCocktails.map((item) => item.cocktail_id);
    allInfo(allCocktails).then((data) => res.send(data));
  }
});

app.post("/api/allCocktails", async (req, res) => {
  let number = req.body.number;
  let limit = req.body.limit;
  console.log(number)
  let dbResponse = await cocktailsByPage(number, limit);
  let totalCount = await totalCocktailsCount();

  console.log(dbResponse)
  allInfo(dbResponse)
      .then((data) => res.send({data, totalCount: totalCount.max}));
});

app.post("/api/findCocktails", async (req, res) => {
  let ingredients = req.body;

  let dbRecipes = await getRecipes();

  let group = dbRecipes.reduce((r, a) => {
    r[a.id_cocktail] = [...(r[a.id_cocktail] || []), a.id_ingredient];
    return r;
  }, {});

  let coctailRecepies = [];
  for (let item in group) {
    coctailRecepies.push({ cocktail_id: item, recepie: group[item] });
  }

  coctailRecepies = coctailRecepies.filter((coctail) => {
    let recepie_ingredients = coctail.recepie;
    return recepie_ingredients.every((ingredient_id) =>
      ingredients.includes(ingredient_id)
    );
  });

  allInfo(coctailRecepies)
      .then((data) => res.send(data));
});

app.listen(PORT);
