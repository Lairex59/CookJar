import { Component, OnInit } from '@angular/core';
import { db } from '../shared/classes/Database';
import { Recipe } from "../shared/classes/Recipe";
import { StabilityAPI } from "../shared/services/StabilityAPI";

/**
 * Lets user add recipes to their favorites for editing or offline support
 */
@Component({
  selector: 'cj-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
    /** Array containing all favorites */
	public favorites!: Recipe[];
    /** Cached list of recipes */
	public recipeListCache!: Recipe[];
    /** Checks if resources have been loaded */
	public resourcesLoaded: boolean = false;
    /** Image in base64 format */
	public imageText: string = "data:image/png;base64, ";
    /** Checks if image has been generated */
	public imageLoaded = true;
    /** Saves the button state */
	public buttonClicked = false;
    /** ID of the recipe */
	public id = "";

    /**
     * Injects the AI for image generation
     * @param image An StabilityAPI object
     */
	constructor(
		private image: StabilityAPI
	) { }

    /** On Init it collects all favorites from the database */
	public ngOnInit(): void {
		db.getAllFavorites().then(data => {
			this.favorites = data;
			this.recipeListCache = data;
		});
	}

    /**
     * Generates an image for the given recipe if requested
     * @param recipe The recipe to generate the image for
     */
	public generateImage(recipe: Recipe) {
		// If you wnat to generate image: uncomment next 3 lines. currently commented out as to not too many api requests while testing other things
		this.imageLoaded = false;
		this.buttonClicked = true;
		this.id = recipe.id;
		this.image.getImage(recipe.titles["en"]).then(image => {
			this.imageText += image.artifacts[0].base64;
			recipe.image_url = this.imageText;
			db.updateFavorite(recipe);
			this.imageLoaded = true;
			this.buttonClicked = false;
		}, error => alert("API couldn't be reached"));
	}

    /**
     * Removes a favorite recipe from the database
     * @param event The registered event
     * @param recipe The recipe you want to remove
     */
	public async removeFavorite(event: Event, recipe: Recipe): Promise<void> {
		if (confirm("Are you sure to remove " + recipe.titles["en"] + " from your favorites?")) {
			event.stopPropagation();
			if (this.favorites.length !== 1) {
			try {
				await db.deleteFavorites(recipe.id).then();
				// this.favorites.forEach((element, index) => {
				// 	if (element.id === recipe.id) {
				// 		delete this.favorites[index];
				// 	}
				// });
				db.getAllFavorites().then(data => {
					this.favorites = data;
					this.recipeListCache = data;
				});
				} catch (err) {
				}
			} else if (this.favorites.length === 1) {
				await db.deleteAllFavorites().then();
				this.favorites = [];
				this.recipeListCache = [];
			}
		}
	}

    /**
     * Removes all recipes from the favorite database
     */
	public removeAll() {
		if (confirm("Are you sure to remove all favorites?")) {
			db.deleteAllFavorites();
			this.favorites = [];
			this.recipeListCache = [];
		}
	}

	/**
     * Allows the user to filter the recipe list
     * @param search
     * @param lang
     */
	public filterRecipe(search: string, lang: string) {
		this.resourcesLoaded = false;
		if (search === "") {
			this.favorites = this.recipeListCache;
			this.resourcesLoaded = true;
		}
		else  {
			this.favorites = this.favorites?.filter((data: Recipe) => {
				const title: string = data.titles[lang];
				if (title)
					return title.toLowerCase().includes(search.toLowerCase());
				return false;
			});
			this.resourcesLoaded = true;
		}
	}

}
