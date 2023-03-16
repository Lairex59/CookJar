import { Recipe } from './Recipe';
import { saveAs } from 'file-saver';
import Dexie from 'dexie';
import { Beer } from './Beer';

/**
 * This class uses the Dexie library to access the IndexedDB database system and store data locally.
 * This is especially useful to save data for the offline access. The class has one table for each object it wants
 * to store:
 * - Recipes: Local and custom recipes of the user
 * - Beers: Beer objects
 * - Favorites: Recipes the user marked as favorites
 */
export class DbService extends Dexie {
    /** Local recipes table */
    private recipes!: Dexie.Table<Recipe, string>;
    /** Local beer table */
    private beers!: Dexie.Table<Beer, string>;
    /** Local favorite recipe table */
    private favorites!: Dexie.Table<Recipe, string>;

    /**
     * The constructor of the Database calls the super-constructor of Dexie to create a new db
     * with a specific name. It also sets the Indexes of each object we want to store and a version
     * of the database. The version is important if we plan to add new table columns to the database tables.
     */
    constructor() {
        super('cookjar-db');
        // Hier wird definiert nach was man suchen kann
        this.version(1).stores({
            recipes: 'id, title, ingredients, languages, cooking_type, tags',
            beer: 'id, name, brew_year, ingredients',
            favorites: 'id, title, ingredients, languages, cooking_type, tags'
        });
        navigator.storage.estimate().then(storage=>console.log("Free storage for DB: ", storage));
    }

/* -------------------------------------*
 * ADDING OBJECTS                       *
 * ------------------------------------ */

    /**
     * Adds a single recipe to the table
     * @param {Recipe} recipe The recipe you want to add
     * @returns {Promise} A Promise containing a result string
    */
    async addRecipe(recipe: Recipe): Promise<string> {
        return this.recipes.add(recipe);
    }

    /**
     * Adds a single beer to the table
     * @param {Beer} beer The beer you want to add
     * @returns {Promise} A Promise containing a result string
    */
    async addBeer(beer: Beer): Promise<string> {
        return this.beers.add(beer);
    }

    /**
     * Adds a single favorite recipe to the table
     * @param {Recipe} recipe The favorite recipe you want to add
     * @returns {Promise} A Promise containing a result string
    */
    async addFavorite(recipe: Recipe): Promise<string> {
        return this.favorites.add(recipe);
    }

/* -------------------------------------*
 * GETTING OBJECTS                      *
 * ------------------------------------ */

    /**
     * Gets a single recipe or undefined from the recipes table
     * @param {string} recipe_id The ID of the recipe object
     * @returns {Promise} A Promise containing the recipe if found, else a promise reject
    */
    async getRecipe(recipe_id: string): Promise<Recipe> {
        const recipe = await this.recipes
            .where('id')
            .equals(recipe_id)
            .first();
        return recipe ? recipe : Promise.reject('Recipe not found');
    }

    /**
     * Gets a single beer or undefined from the beers table
     * @param {string} beer_id The ID of the beer object
     * @returns {Promise} A Promise containing the beer if found, else a promise reject
    */
    async getBeer(beer_id: string): Promise<Beer> {
        const beer = await this.beers
            .where('id')
            .equals(beer_id)
            .first();
        return beer ? beer : Promise.reject('Beer not found');
    }

    /**
     * Gets a single recipe or undefined from the favorites table
     * @param {string} fav_id The ID of the favorite recipe object
     * @returns {Promise} A Promise containing the recipe if found, else a promise reject
    */
    async getFavorite(fav_id: string): Promise<Recipe> {
        const favorite = await this.favorites
            .where('id')
            .equals(fav_id)
            .first();
        return favorite ? favorite : Promise.reject('Favorite not found');
    }

/* -------------------------------------*
 * GETTING ALL OBJECTS                  *
 * ------------------------------------ */

    /**
     * Retrieves all recipes as an Recipe-Array from the local database
     * @returns {Promise} A Promise containing a Recipe[] Array
     */
    async getAllRecipe(): Promise<Recipe[]> {
        return this.recipes
            .where('id')
            .notEqual('')
            .sortBy('title');
    }

    /**
     * Retrieves all beers from the local database
     * @returns {Promise} A Promise containing a Beer[] Array
     */
    async getAllBeer(): Promise<Beer[]> {
        return this.beers
            .where('id')
            .notEqual('')
            .sortBy('title');
    }

    /**
     * Retrieves all favorite recipes from the local database
     * @returns {Promise} A Promise containing a Recipe[] Array
     */
    async getAllFavorites(): Promise<Recipe[]> {
        return this.favorites
            .where('id')
            .notEqual('')
            .sortBy('title');
    }

/* -------------------------------------*
 * UPDATING OBJECTS                     *
 * ------------------------------------ */

    /**
     * Updates an existing recipe by replacing it with a given new recipe.
     * REMEMBER that the ID neews to remain unchanged
     * @param {Recipe} recipe The new recipe containing the new attributes
     * @returns {Promise} A Promise containing a number indicating how many objects were changed
     */
    async updateRecipe(recipe: Recipe): Promise<number> {
        return this.recipes.update(recipe.id, recipe);
    }

    /**
     * Updates an existing beer by replacing it with a given new one.
     * REMEMBER that the ID needs to remain unchanged
     * @param {Beer} beer The new recipe with new attributes
     * @returns {Promise} A Promise containing a number indicating how many objects were changed
     */
    async updateBeer(beer: Beer): Promise<number> {
        return  this.beers.update(beer.id, beer);
    }

    /**
     * Updates an existing favorite recipe by replacing it with a new one.
     * REMEMBER that the ID must remain unchanged
     * @param {Recipe} recipe The new recipe with changed attributes
     * @returns {Promise} A Promise containing a number indicating how many objects were changed
     */
    async updateFavorite(recipe: Recipe): Promise<number> {
        return this.favorites.update(recipe.id, recipe);
    }

/* -------------------------------------*
 * DELETING OBJECTS                     *
 * ------------------------------------ */

    /**
     * Deletes a recipe by a given ID
     * @param {string} recipe_id The recipe ID of the recipe you want to delete
     * @returns {void} Nothing
     */
    async deleteRecipe(recipe_id: string): Promise<void> {
        return this.recipes.delete(recipe_id);
    }

    /**
     * Deletes a beer by a given ID
     * @param {string} beer_id The beer ID of the beer you want to delete
     * @returns {void} Nothing
     */
    async deleteBeer(beer_id: string): Promise<void> {
        return this.beers.delete(beer_id);
    }

    /**
     * Deletes a favorited recipe by a given ID
     * @param {string} fav_id The favorite ID of the recipe you want to delete
     * @returns {void} Nothing
     */
    async deleteFavorites(fav_id: string): Promise<void> {
        return this.favorites.delete(fav_id);
    }

/* -------------------------------------*
 * DELETING ALL OBJECTS                 *
 * ------------------------------------ */

    /**
     * Deletes all recipes
     * @returns void
     */
    async deleteAllRecipes() {
		return this.getAllRecipe().then(data => {
			for (let recipe of data) {
				this.recipes.delete(recipe.id);
			}
		})
	}

    /**
     * Deletes all beer
     * @returns void
     */
    async deleteAllBeer() {
        return this.getAllBeer().then(data => {
            for (let beer of data) {
                this.beers.delete(beer.id);
            }
        })
    }

    /**
     * Deletes all favorites
     * @returns void
     */
    async deleteAllFavorites() {
        return this.getAllFavorites().then(data => {
            for (let fav of data) {
                this.favorites.delete(fav.id);
            }
        })
    }

/* -------------------------------------*
 * FILTERING OBJECTS                    *
 * ------------------------------------ */

    /**
     * Gets all recipes that somewhat equal the given title
     * @param {string} recipe_title The title you want to filter for
     * @returns {Promise} A Promise containing an Array of Recipes
     */
    async getRecipeByTitle(recipe_title: string): Promise<Recipe[]> {
        return this.recipes
            .where('title')
            .equals(recipe_title)
            .sortBy('title');
    }

    /**
     * Gets all Beer that somewaht equal the given title
     * @param {string} beer_title The title you want to filter for
     * @returns {Promise} A Promise containing an Array of Beer
     */
    async getBeerByTitle(beer_title: string): Promise<Beer[]> {
        return this.beers
            .where('name')
            .equals(beer_title)
            .sortBy('name');
    }

    /**
     * Gets all favorited Recipes that somewhat equal the given title
     * @param {string} fav_title The title you want to filter for
     * @returns {Promise} A Promise containing an Array of Recipes
     */
    async getFavoriteByTitle(fav_title: string): Promise<Recipe[]> {
        return this.favorites
            .where('title')
            .equals(fav_title)
            .sortBy('title');
    }

    /**
     * Gets all Recipes that containe given ingredients
     * @param {string[]} ingredients List of ingredients you want to filter for
     * @returns {Promise} A Promise containing an Array of Recipes
     */
    async getRecipeByIngredients(ingredients: string[]): Promise<Recipe[]> {
        return this.recipes
            .where('ingredients')
            .equals(ingredients)
            .sortBy('title');
    }

    /**
     * Gets all Beer that contains given ingredients
     * @param {string[]} ingredients List of ingredients you want to filter for
     * @returns {Promise} A Promise containing an Array of Beer
     */
    async getBeerByIngredients(ingredients: string[]): Promise<Beer[]> {
        return this.beers
            .where('ingredients')
            .equals(ingredients)
            .sortBy('name');
    }

    /**
     * Gets all favorite Recipes that contain given ingredients
     * @param {string[]} ingredients List of ingredients you want to filter for
     * @returns {Promise} A Promise containing an Array of Recipes
     */
    async getFavoriteByIngredients(ingredients: string[]): Promise<Recipe[]> {
        return this.favorites
            .where('ingredients')
            .equals(ingredients)
            .sortBy('title');
    }

/* -------------------------------------*
 * IMPORT & EXPORT                      *
 * ------------------------------------ */

    /**
     * Exports the database by creating a json file and using the FileSaver library
     */
    async exportDatabase() {
        const recipes = await this.recipes.toArray();
        const data = JSON.stringify({ recipes });

        const blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'database.json');
        // <button (click)="exportDatabase()">Export</button>
    }

    /**
     * Imports the database from a given JSON file
     * @param {File} file A JSON containing all the data of the Database
     */
    async importDatabase(file: File) {
        const reader = new FileReader();
        reader.readAsText(file);
		console.log("inn");
        reader.onload = async () => {
            const { recipes } = JSON.parse(reader.result as string);
			console.log(recipes);
            await this.transaction('rw', this.recipes, async () => {
                await this.recipes.bulkAdd(recipes);
            });
        };
    }



}
/** Exports the Database as a constant variable */
export const db = new DbService();
