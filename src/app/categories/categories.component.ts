import { Component, OnInit } from '@angular/core';
import { MediaObserver } from "@angular/flex-layout";
import { Router } from "@angular/router";
import { Recipe } from "../shared/classes/Recipe";
import { RecipeAPI } from "../shared/services/RecipeAPI";

/**
 * This component showcases the different recipe types and categories
 */
@Component({
  selector: 'cj-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
    /** Holds the recipe list for filtering */
	public recipeList!: Recipe[];
    /** Checks when the resources are loaded */
	public resourcesLoaded: boolean = false;
    /** Array holding all categories */
	public categories: string[] = [];

    /**
     * The constructor injects all necessary objects
     * @param recipeApi The API for the recipe filtering
     * @param router Router for navigation
     * @param media Media Observer for screen size
     */
	constructor(
		public recipeApi: RecipeAPI,
		private router: Router,
		private media: MediaObserver
	) { }

    /**
     * Filters out the needed recipes and then showcases the available categories
     */
	public ngOnInit(): void {
		this.recipeApi.get_all_recipes().subscribe((data: Recipe[]) => {
			this.recipeList = data;
			this.resourcesLoaded = true;
			for (let recipe of data) {
				if (recipe.cooking_type["en"] && !this.categories.includes(recipe.cooking_type["en"])) {
					this.categories.push(recipe.cooking_type["en"]);
				}
			}
			this.categories.push("Beer");
			this.categories.push("Vorspeise");
			this.categories.push("Nachspeise");
			this.resourcesLoaded = false;
			this.recipeList = data;
			this.resourcesLoaded = true;
		}, error => alert("API couldn't be reached"));
	}

    /**
     * When the user clicks a category, it takes the user to a list of filtered objects
     * @param category The selected category
     */
	public navigate(category: string)  {
		switch(category) {
			case "Beer": {
				this.router.navigate(["/" + category.toLowerCase()]);
				break;
			}
			default: {
				this.router.navigate(["/recipeList"], { queryParams: { filter: category } });
			}
		}
	}

	/**
	 * Gets for columns per active media size
	 */
	public get cols(): number {
		if (this.media.isActive("xl"))
			return 4;
		else if (this.media.isActive("lg"))
			return 3;
		else if (this.media.isActive("md"))
			return 3;
		else if (this.media.isActive("sm"))
			return 2;
		return 1;
	}

	public get gutterSize(): number {
		if (this.media.isActive("xl"))
			return 10;
		else if (this.media.isActive("lg"))
			return 10;
		else if (this.media.isActive("md"))
			return 0;
		else if (this.media.isActive("sm"))
			return 0;
		return 0;
	}

}
