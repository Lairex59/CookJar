import { v4 as uuidv4 } from 'uuid';

/**
 * This class is responsible for holding all information retrieved from the Openfoodfacts API
 */
export class FoodFact {
    /** The id of the entry, in most cases its the barcode, else it gets generated from uuidv4 */
    id: string = uuidv4();
    /** The name of the prouct */
    product_name: string = "";
    /** A more generic name of the product */
    common_name: string = "";

    /** The quantity of the product, mostly in grams
     * @example
     * "155 g"
     */
    quantity: string = "";
    /** The brand of the product / company of the product */
    brand_owner: string = "";
    /** A string containing the categories separated by comma */
    categories: string = "";
    /** Additional labels and awards for the product */
    labels: string = "";
    /** The land where the product originated from */
    ingredients_origin: string = "";
    /** The countries where the product is mostly sold in. A string separated by comma */
    sold_in_countries: string = "";

    /** A list of ingredients as a string separated by comma */
    ingredients: string = "";
    /** An array of allergenes */
    allergens: string[] = [];
	/** The energy value in this product */
    energy_value: string = "";

    /** An array indicating the amount of processing with a number and its name
     * @example
     * "4-ultra-processed-food-and-drink-products"
     */
    food_processing: string[] = [];

    /** An array of possible additives with their scientific name
     * @example
     * "e330"
     */
    additives: string[] = [];

    /** An array indicating ingredients that are important for people with special food lifestyle
     * @example
     * "vegan-status-unknown"
     */
    ingredient_analysis: string[] = [];
    /** A simple letter indicating the nutrition quality, 'A' being the best */
    nutrition_quality: string = "";

    /** The front of the product as image url */
    image_front_url: string = "";
    /** The URL of an image showing the ingredients page */
    image_ingredients_url: string = "";
    /** The URL of an image showing the nutrition page */
    image_nutrition_url: string = "";
}
