import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Beer } from "../classes/Beer";
import { v4 as uuidv4 } from 'uuid';

/**
 * This class is a Helper that retrives data from the Beer API and returns Beer Objects
 */
@Injectable({
	providedIn: "root"
})
export class BeerAPI {
    /** This URL is where all the API calls will go to */
    private base_api_url = "https://api.punkapi.com/v2/beers";

    /**
     * The constructors injects the necessary HttpClient
     * @param {HttpClient} http Injected HttpClient for API requests
     */
    constructor(private http: HttpClient) { }

    /**
     * Searches for a Beer by a given ID
     * @param {string} beer_id The ID of the beer you want to find
     * @returns {Observable} An Observable containing a Beer object
     */
    public getBeer(beer_id: string): Observable<Beer> {
        return this.http.get<Beer>(`${this.base_api_url}/${beer_id}`)
            .pipe(map(response => this.create_beer(response)));
    }

    /**
     * Searches for a random beer
     * @returns {Observable} An Observable containing a Beer object
     */
    public getRandomBeer(): Observable<Beer> {
        return this.http.get(`${this.base_api_url}/random`)
            .pipe(map(response => this.create_beer(response)));
    }

    /**
     * Each beer can be combined to a different food product, and this function allows you to search for
     * a beer that has one of these food products
     * @param {string} food_name The food you want to search a match for
     * @returns {Observable} An Observable containing a Beer object
     */
    public getBeerByFood(food_name: string): Observable<Beer> {
        return this.http.get(`${this.base_api_url}?food=${food_name}`)
            .pipe(map(response => this.create_beer(response)));
    }

    /**
     * Searches a beer by its name
     * @param {string} beer_name The name of the beer
     * @returns {Observable} An Observable containing a Beer object
     */
    public getBeerByName(beer_name: string): Observable<Beer> {
        return this.http.get(`${this.base_api_url}?beer_name=${beer_name}`)
            .pipe(map(response => this.create_beer(response)));
    }

    /**
     * Searches a beer by its yeast
     * @param {string} yeast Yeast to search for
     * @returns {Observable} An Observable containing a Beer object
     */
    public getBeerByYeast(yeast: string): Observable<Beer> {
        return this.http.get(`${this.base_api_url}?yeast=${yeast}`)
            .pipe(map(response => this.create_beer(response)));
    }

    /**
     * Will iterate through each page the API returns and build an array of Beer objects
     * @returns {Observable} An Observable containing a Beer object
     */
    public getAllBeer(): Observable<Beer[]> {
        let beer_array: Beer[] = [];

        return new Observable(observer => {
            const fetchNextPage = (page_nr: number) => {
                console.log("Fetching beer page: ", page_nr);
                this.http.get(`${this.base_api_url}?page=${page_nr}`)
                    .subscribe((response: any) => {
                        if (response.length === 0) {
                            observer.next(beer_array);
                            observer.complete();
                            return;
                        } else {
                            for (let beer of response) {
                                beer_array.push(this.create_beer(beer));
                            }
                            fetchNextPage(page_nr + 1);
                        }
                    });
            };

            fetchNextPage(1);
        });
    }

    /**
     * @internal
     * A private method that creates a Beer object from a given JSON string
     * @param dirty_json The JSON string
     * @returns {Beer} The converted Beer object
     */
    private create_beer(dirty_json: any): Beer {
        const beer = new Beer();
        let is_malformed = false;

        if (Array.isArray(dirty_json)) {
            console.log("Warning, JSON is Array");
            dirty_json = dirty_json[0];
        }

        try {
            beer.id = dirty_json?.id ?? uuidv4();
            beer.name = dirty_json?.name;
            beer.tagline = dirty_json?.tagline;
            beer.brew_year = dirty_json?.first_brewed;
            beer.description = dirty_json?.description;
            beer.image_url = dirty_json?.image_url;
            beer.yeast = dirty_json?.ingredients?.yeast;

            let ingredients_arr = dirty_json?.ingredients?.malt ?? [];
             for (let iter = 0; iter <= ingredients_arr.length-1; iter++) {
                 let name = ingredients_arr[iter]?.name;
                 let amount = ingredients_arr[iter]?.amount?.value + " " + ingredients_arr[iter]?.amount?.unit;
                 beer.ingredients[name] = amount;
             }

            beer.food_pairing = dirty_json?.food_pairing;
            beer.brewing_tips = dirty_json?.brewers_tips;
            beer.contributor = dirty_json?.contributed_by;

        } catch(err) {
            console.warn(`The beer with the ID '${beer.id}' is malformed`);
            is_malformed = true;
        }

        return is_malformed ? new Beer() : beer;
    }
}
