import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Recipe } from "../shared/classes/Recipe";
import { RecipeAPI } from "../shared/services/RecipeAPI";

/**
 * The idea behind this feature was to have a list where the user can input all ingredients he currently
 * has or wants to use and the app searches for recipes that
 * use either at least those ingredients, or only those
 */
@Component({
  selector: 'cj-fridge',
  templateUrl: './fridge.component.html',
  styleUrls: ['./fridge.component.scss']
})
export class FridgeComponent implements OnInit {
    /** The form for the user */
	form!: FormGroup;
    /** A list of possible recipes */
	public recipes: Recipe[] = [];
    /** Checks if recipes are loaded */
	public recipeLoaded = true;
    /** Saves the state of the button */
	public buttonClicked = false;

    /**
     * The constructor injects important objects
     * @param fb The FormBuilder for the form
     * @param recipeApi The API to retrieve recipes
     */
	constructor(
		private fb: FormBuilder,
		private recipeApi: RecipeAPI
	) { }

    /**
     * Gets executed when initialized and basically shows the form
     */
	public ngOnInit(): void {
		this.form = this.fb.group({
			ingredientList: this.fb.array(
				[
					this.fb.group(
						{
							ingredient: ["", Validators.required]
						}
					),
				],
				{ validators: Validators.required }
			)
		});
	}

    /**
     * Getter method for retrieving ingredients
     */
	public get ingredients(): FormArray {
		return this.form.get("ingredientList") as FormArray;
	}

    /**
     * Allows for removing ingredients from the form
     * @param i The Index of the ingredient
     */
	public removeIngredientsControl(i: number) {
		this.ingredients.removeAt(i);
	}

    /**
     * Adds an ingredient entry to the form
     */
	public addIngredientsControl() {
		this.ingredients.push(
			this.fb.group({
				ingredient: [null, Validators.required]
			})
		);
	}

    /**
     * The actual fridge functionality
     */
	public fridge() {
		this.recipeLoaded = false;
		this.buttonClicked = true;
		let arr: string[] = [];
		this.recipes = [];
		for (let ingredient of this.ingredients.value) {
			arr.push(ingredient.ingredient);
		}
		this.recipeApi.get_all_recipes_by_ingredients("en", arr).subscribe(recipes => {
			this.recipes = recipes;
			this.recipeLoaded = true;
			this.buttonClicked = false;
		}, error => alert("API couldn't be reached"))
	}

    /** Does some parsing to clean ingredients */
	public removeStarsInIngreidents(ingredient: string) {
		return ingredient.replace(/\*\*/g, " ");
	}
}
