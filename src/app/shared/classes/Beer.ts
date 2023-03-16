import { v4 as uuidv4 } from 'uuid';

/**
 * This class contains all information of a Beer. This information is commonly extracted from the API,
 * but it can also be entered manually. The only required attribute of the object is the ID. Everything else can,
 * but should not, be empty.
 */
export class Beer {
    /** The ID can either be manually set, or else it will be generated from the uuidv4 function */
    id: string = uuidv4(); // Necessary
    /** The name of the beer */
    name: string = "";
    /** A short description of the beer */
    tagline: string = "";
    /** The year the beer was brewed */
    brew_year: string = "";
    /** Description of the beer */
    description: string = "";
    /** An URL to an image in the beer database */
    image_url: string = "";
    /** The yeast value */
    yeast: string = "";

    /** A dictionary of ingredients that has the name of the ingredient as key and the amount as value
     * @example
     * {"Maris Otter Extra Pale": "3.3 kilograms", "Caramalt": "0.2 kilograms"}
     */
    ingredients: Record<string, string> = {};

    /** An array containing possible food pairings as strings
     * @example
     * ["Spicy chicken tikka masala", "Grilled chicken quesadilla", "Caramel toffee cake"]
     */
    food_pairing: string[] = [];
    
    /** Additional brewing tips */
    brewing_tips: string = "";
    /** Name of the person that uploaded this entry in the database */
    contributor: string = "";
}
