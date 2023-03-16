import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { Recipe } from "../shared/classes/Recipe";
import { BeerAPI } from "../shared/services/BeerAPI";
import { RecipeAPI } from '../shared/services/RecipeAPI';
import { StabilityAPI } from "../shared/services/StabilityAPI";
import { db } from "../shared/classes/Database";

/**
 * This is the homepage of the application. It contains the daily recipe
 * and if selected then your top three favorites
 */
@Component({
  selector: 'cj-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    /** Current date */
	public date: Date = new Date();
    /** Single recipe */
	public recipe!: Recipe;
    /** Single image in base64 format */
	public imageText: string = "data:image/png;base64, ";
    /** Checks if image is loaded */
	public imageLoaded = true;
    /** Saves the state of the button */
	public buttonClicked = false;
    /** List of favorite recipes */
	public favorites: Recipe[] = [];

    /**
     * The constructor injects useful and needed objects
     * @param cookie The cookie for daily recipe
     * @param recipeApi The API to retrieve a random recipe
     * @param image The AI for image and text generation
     * @param router The router for navigation
     * @param beerApi The API to retrieve beer
     */
	constructor(
		private cookie: CookieService,
		private recipeApi: RecipeAPI,
		private image: StabilityAPI,
		private router: Router,
		private beerApi: BeerAPI
	) { }

    /**
     * Initialises the component and sets its data
     */
	public async ngOnInit(): Promise<void> {
		let id = this.cookie.get("daily");
		this.recipeApi.get_recipe(id).subscribe(recipe => {
			this.recipe = recipe;
			// If you wnat to generate image: uncomment next 3 lines. currently commented out as to not too many api requests while testing other things
			// this.image.getImage(recipe.titles[this.route.snapshot.params.lang]).then(image => {
			// 	this.imageText += image.artifacts[0].base64;
			// });
		});
		db.getAllFavorites().then(data => {
			if (data.length > 3) {
				this.favorites = this.getMultipleRandom(data, 3);
			} else {
				this.favorites = data;
			}
		});
	}

    /**
     * Generates an image on requests
     */
	public generateImage() {
		// If you wnat to generate image: uncomment next 3 lines. currently commented out as to not too many api requests while testing other things
		this.imageLoaded = false;
		this.buttonClicked = true;
		this.image.getImage(this.recipe.titles["en"]).then(image => {
			this.imageText += image.artifacts[0].base64;
			this.imageLoaded = true;
			this.buttonClicked = false;
		}, error => alert("API couldn't be reached"));
	}

    /**
     * Retrieves a random beer from the API
     */
	public randomBeer() {
		this.beerApi.getRandomBeer().subscribe(data => {
			this.router.navigate(['/beerEntry/' + data.id]);
		}, error => alert("API couldn't be reached"))
	}

    /**
     * A custom randomizer to get random recipes
     * @param arr array to fill
     * @param num amount of recipes
     * @returns Array of Recipes
     */
	public getMultipleRandom(arr: Recipe[], num: number) {
		const shuffled = [...arr].sort(() => 0.5 - Math.random());
		return shuffled.slice(0, num);
	}

    /**
     * Parses the ingredients by cleaning the text
     * @param ingredient Single ingredient
     * @returns A cleaned up ingredient
     */
	public removeStarsInIngreidents(ingredient: string) {
		return ingredient.replace(/\*\*/g, " ");
	}

    /**
     * Navigates to the recipe on click
     * @param recipe Selected recipe
     * @param lang Current language
     */
	public navigate(recipe: Recipe, lang: string) {
		this.router.navigate([`/recipeEntry/${recipe.id}/${lang}`]);
	}

}
