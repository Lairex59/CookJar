import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Recipe } from "../shared/classes/Recipe";
import { RecipeAPI } from "../shared/services/RecipeAPI";
import { db } from "../shared/classes/Database";

/**
 * This component lists all recipes and lets the user interact with them
 */
@Component({
  selector: 'cj-receipe-list',
  templateUrl: './receipe-list.component.html',
  styleUrls: ['./receipe-list.component.scss']
})
export class ReceipeListComponent implements OnInit {
    /** List of recipes */
	public recipeList!: Recipe[];
    /** Cached list of recipes */
	public recipeListCache!: Recipe[];
    /** Checks if resources have been loaded */
	public resourcesLoaded: boolean = false;
    /** Saves the database as variable */
	public dB = db;
    /** Favorited recipes array */
	public favorites: string[] = [];

    /**
     * The constructor injects important objects
     * @param recipeApi The API for data retrieval
     * @param route The current route
     * @param router The navigation controller
     */
	constructor(
		public recipeApi: RecipeAPI,
		private route: ActivatedRoute,
		private router: Router
	) { }

    /**
     * Initialises the component with the list of recipes in a specific language
     */
	public async ngOnInit() {
		let filter: string[] = [this.route.snapshot.queryParamMap.get("filter")?.toLowerCase() ?? ""];
		if (!filter[0])
			this.recipeApi.get_all_recipes().subscribe((data: Recipe[]) => {
				this.resourcesLoaded = false;
				this.recipeList = data;
				this.recipeListCache = data;
				this.resourcesLoaded = true;
			}, error => alert("API couldn't be reached"));
		if (filter[0] !== "" && filter[0] === "vegetarian")
			this.recipeApi.get_all_recipes_by_cooking("en", "Vegetarian").subscribe(data => {
				console.log(data);
				this.resourcesLoaded = false;
				this.recipeList = data;
				this.recipeListCache = data;
				this.resourcesLoaded = true;
			}, error => alert("API couldn't be reached"));
		if (filter[0] !== "" && filter[0] !== "Vegetarian")
			this.recipeApi.get_all_recipes_by_tag(filter).subscribe(data => {
				this.resourcesLoaded = false;
				this.recipeList = data;
				this.recipeListCache = data;
				this.resourcesLoaded = true;
			}, error => alert("API couldn't be reached"));
		db.getAllFavorites().then(data => {
			for (let recipe of data) {
				this.favorites.push(recipe.id);
			}
		});
		// fridge functionality
        this.recipeApi.get_all_recipes_by_ingredients('it', ["120 g di burro", "100 g di burro"]).subscribe(data => console.log(data));
	}

    /**
     * Allows the user to filter the recipe list
     * @param search
     * @param lang
     */
	public filterRecipe(search: string, lang: string) {
		this.resourcesLoaded = false;
		if (search === "") {
			this.recipeList = this.recipeListCache;
			this.resourcesLoaded = true;
		}
		else  {
			this.recipeList = this.recipeList?.filter((data: Recipe) => {
				const title: string = data.titles[lang];
				if (title)
					return title.toLowerCase().includes(search.toLowerCase());
				return false;
			});
			this.resourcesLoaded = true;
		}
	}

    /**
     * Parses the ingredient
     * @param ingredient A single ingredient
     * @returns A cleaned up string
     */
	public removeStarsInIngreidents(ingredient: string) {
		return ingredient.replace(/\*\*/g, " ");
	}

    /**
     * The filter functionality
     */
	public filter() {
		if (this.route.snapshot.queryParamMap.get("filter")) {
			this.router.navigate(['/recipeList']);
			this.recipeApi.get_all_recipes().subscribe((data: Recipe[]) => {
				let filter = this.route.snapshot.queryParamMap.get("filter");
				if (filter)
					data = data.filter(recipe => recipe.cooking_type["en"] === filter);
				this.resourcesLoaded = false;
				this.recipeList = data;
				this.recipeListCache = data;
				this.resourcesLoaded = true;
			}, error => alert("API couldn't be reached"));
		}
		else {
			this.router.navigate(['./recipeList'], { queryParams: { filter: 'Vegetarian' }});
			this.recipeApi.get_all_recipes().subscribe((data: Recipe[]) => {
				let filter = this.route.snapshot.queryParamMap.get("filter");
				if (filter)
					data = data.filter(recipe => recipe.cooking_type["en"] === filter);
				this.resourcesLoaded = false;
				this.recipeList = data;
				this.recipeListCache = data;
				this.resourcesLoaded = true;
			}, error => alert("API couldn't be reached"));
		}
	}

    /**
     * Allows the user to add recipes to the database for offline storage
     * @param event The event
     * @param recipe The recipe you want to add
     */
	public addToDB(event: Event, recipe: Recipe) {
		event.stopPropagation();
		try {
			db.addRecipe(recipe);
		} catch(err) {
		}
	}

    /**
     * Adds a recipe to your favorites (also in the databse)
     * @param event The Event
     * @param recipe The recipe to add
     */
	public async addFavorite(event: Event, recipe: Recipe): Promise<void> {
		event.stopPropagation();
		try {
			db.addFavorite(recipe);
			this.favorites.push(recipe.id);
		} catch (err) {

		}
	}

    /**
     * Removes a favorite recipe (also from the database)
     * @param event The event
     * @param recipe The recipe to remove
     */
	public async removeFavorite(event: Event, recipe: Recipe): Promise<void> {
		event.stopPropagation();
		try {
			db.deleteFavorites(recipe.id);
			this.favorites.forEach((element, index) => {
				if (element === recipe.id) {
					delete this.favorites[index];
				}
			});
		} catch (err) {

		}
	}

}
