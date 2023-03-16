import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { FoodFact } from "../classes/FoodFact";

/**
 * This class manages calls to the openfoodfacts API. It basically provides methods that call the api,
 * retrieves its data and returns an appropriate object that can then be used on the frontend
 */
@Injectable({
	providedIn: "root"
})
export class FoodFactAPI {
    /** This is the base URL to which all requests will go */
    private base_api_url = "https://world.openfoodfacts.org/api/v3/product";

    /**
     * The constructors injects the necessary HttpClient
     * @param {HttpClient} http Injected HttpClient for API requests
     */
    constructor(private http: HttpClient) { }

    /**
     * It retrieves all available food facts of a given ID. The id can also be a barcode
     * @param {string} fact_id The ID or barcode of the foodfact to search for
     * @returns {Observable} An Observable containing the FoodFact object
     */
    public get_food_fact(fact_id: string): Observable<FoodFact> {
        return this.http.get<FoodFact>(`${this.base_api_url}/${fact_id}`)
            .pipe(map(response => this.create_food_fact(response)));
    }

    /**
     * @internal
     * This is a private function that converts the given JSON string to an FoodFact object
     * @param dirty_json JSON Object
     * @returns A FoodFact object
     */
    private create_food_fact(dirty_json: any): FoodFact {
        const ffact = new FoodFact();
        let is_malformed = false;

        let errors: string[] = dirty_json?.errors;
        let product = dirty_json?.product;

        if (errors.length) {
            console.error("Found following errors: ", errors.toString());
            return new FoodFact();
        } else {
            try {
                ffact.id = product?.id ?? uuidv4();
                ffact.product_name = product?.product_name;
                if (!ffact.product_name) {
                    is_malformed = true;
                }
                ffact.common_name = product?.generic_name;
                ffact.quantity = product?.quantity;
                ffact.brand_owner = product?.brands;
                ffact.categories = product?.categories;
                ffact.labels = product?.labels;
                ffact.ingredients_origin = product?.origins;
                ffact.sold_in_countries = this.cut(product?.countries);

                ffact.ingredients = product?.ingredients_text;
                ffact.allergens = this.cut_text(product?.allergens_tags);

                ffact.food_processing = this.cut_text(product?.nova_groups_tags)?.map(str => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));;
                ffact.additives = this.cut_text(product?.additives_tags);
                ffact.ingredient_analysis = this.cut_text(product?.ingredients_analysis_tags)?.map(str => str.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));;
                ffact.nutrition_quality = product?.nutrition_grades;

                ffact.image_front_url = product?.image_front_url;
                ffact.image_ingredients_url = product?.image_ingredients_url;
                ffact.image_nutrition_url = product?.image_nutrition_url;
                ffact.energy_value = product?.nutriments.energy_value;

            } catch (err) {
                console.warn(`The food fact with the ID '${ffact.id}' is malformed`);
                is_malformed = true;
            }
			const malformed = new FoodFact();
			malformed.product_name = "malformed"
            return is_malformed ? malformed : ffact;
        }
    }

    /**
     * @internal
     * Removes everything before the ':' character of a given string
     */
	private cut(text: string): string {
		return text.substring(text.indexOf(":") + 1);
	}

    /**
     * @internal
     * Does the same as the cut function, but for arrays
     */
    private cut_text(raw_text: string[]): string[] {
        return raw_text.map(element => element.substring(element.indexOf(":") + 1))
    }
}
