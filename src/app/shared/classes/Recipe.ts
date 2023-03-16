import { v4 as uuidv4 } from 'uuid';

/**
 * This class represents the main component of the whole project, the Recipe. Recipes are mainly retrieved from
 * APIs, but users can also create custom recipes that then are stored on the local database instead.
 * To allow users to store recipes in a database, the ID has to be set and is by default generated randomly.
 * Sometimes, the API can also set an ID.
 */
export class Recipe {
    /** The ID of the Recipe is either enetered manually of generated from uuidv4 */
    id: string = uuidv4();
    /** The URL of the API where the recipe comes from */
    api_url: string = "";
    /** All the different languages the recipe has */
    languages: string[] = [];
    /** A dictionary where the key is the language and the value is the title in that language */
    titles: Record<string, string> = {};
    /** A dictionary where the key is the language and the value is a shorter description of the recipe */
    intro_text: Record<string, string> = {};
    /** A dictionary where the key is the language and the value is mostly a link to a YouTube video */
    additional_text: Record<string, string> = {};
    
    /** Tags for the recipe
     * @example
     * ["nachspeise", "freilandeier", "milchmilchprodukte", "ricette vegetariane"]
     */
    tags: string[] = [];
    /** A dictionary where the key is the language and the value are the preparation isntructions */
    preparation_text: Record<string, string> = {};
    /** The amount of time it approximately takes to make this recipe, format varies, therefore its a string */
    preparation_time: string = "";
    /** A dictionary where the key is the language and the value is an array of ingredients with their amount */
    ingredients: Record<string, any[]> = {};
    /** The amount of persons this recipe is for */
    person_count: string = "";

    /** A dictionary where the key is the language and the value indicates its cooking type
     * @example
     * {"de": "Vegetarisch"}
     */
    cooking_type: Record<string, string> = {};
    /** The URL of an image provided by the API, is probably empty because of copyright reasons */
    image_url: string = "";
    /** The actual image in base64 format */
    image: string = ""; // base64
}
