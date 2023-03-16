import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Recipe } from "../shared/classes/Recipe";
import { v4 as uuidv4 } from 'uuid';
import { db } from "../shared/classes/Database";
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";

/**
 * This class contains a form that allows the user to add and later edit their custom recipes
 */
@Component({
  selector: 'cj-add-edit-recipe',
  templateUrl: './add-edit-recipe.component.html',
  styleUrls: ['./add-edit-recipe.component.scss']
})
export class AddEditRecipeComponent implements OnInit {
    /** The variable containing the form */
	form!: FormGroup;
    /** Uploaded images */
	public imagePath = "";
    /** Uploaded custom messages */
	public message = "";
    /** Image URL */
	public imgURL: any = "";
    /** Recipe ID */
	public id: string = "";

    /**
     * The constructor mainly sets the routing location and injects the FormBuilder
     * @param location current router location
     * @param fb Injected FormBuilder
     * @param route The router for navigation
     */
	constructor(
		private location: Location,
		private fb: FormBuilder,
		private route: ActivatedRoute
	) { }

    /**
     * This function gets called on the first initialisation of the class
     * and basically displays the form with its values
     */
	public ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		if (this.id) {
			db.getRecipe(this.id).then(item => {
				if (item) {
					this.form.patchValue(item);
					(this.form.controls.titles as FormGroup).setValue((item.titles["en"]) as String);
					(this.form.controls.intro_text as FormGroup).setValue((item.intro_text["en"]) as String);
					(this.form.controls.video_link as FormGroup).setValue((item.additional_text["en"]) as String);
					(this.form.controls.preparation_text as FormGroup).setValue((item.preparation_text["en"]) as String);
					(this.form.controls.cooking_type as FormGroup).setValue((item.cooking_type["en"]) as String);
					this.imgURL = item.image;
					this.removeIngredientsControl(0);
					for (let i = 0; i < item.ingredients["en"].length; i++) {
						this.ingredients.push(
							this.fb.group({
								ingredient: item.ingredients["en"][i].ingredient ?? (item.ingredients["en"])[i]
							})
						)
					}
				}
			});
		}
		const recipe: Recipe = new Recipe();
			this.form = this.fb.group({
			titles: [recipe.titles["en"], Validators.required],
			intro_text: [recipe.intro_text["en"]],
			tags: [recipe.tags],
			video_link: [recipe.additional_text["en"]],
			preparation_text: [recipe.preparation_text["en"], Validators.required],
			preparation_time: [recipe.preparation_time, Validators.required],
			ingredientList: this.fb.array(
				[
					this.fb.group(
						{
							ingredient: [recipe.ingredients["en"], Validators.required]
						}
					),
				],
				{ validators: Validators.required }
			),
			person_count: [recipe.person_count],
			cooking_type: [recipe.cooking_type["en"]]
		});
	}

    /**
     * Getter method for the ingredients
     */
	public get ingredients(): FormArray {
		return this.form.get("ingredientList") as FormArray;
	}

    /**
     * Removes ingredients on the form
     * @param i Index of the ingredient to remove
     */
	public removeIngredientsControl(i: number) {
		this.ingredients.removeAt(i);
	}

    /**
     * Adds an ingredient slot on the form
     */
	public addIngredientsControl() {
		this.ingredients.push(
			this.fb.group({
				ingredient: [null, Validators.required]
			})
		);
	}

    /**
     * Handles file input / upload
     * @param files The uploaded file
     */
	public handle(files: any){
		if (files.length !== 0) {
			let mimeType = files[0].type;
			if (mimeType.match(/image\/*/) != null) {
				let reader = new FileReader();
				this.imagePath = files;
				reader.readAsDataURL(files[0]);
				reader.onload = (_event) => {
					this.imgURL = reader.result;
				}
			}
			else {
				this.message = "Only Images are allowed";
				console.log(this.message);
			}
		}
	}

    /**
     * Adds the new recipe from the form to the database
     */
	public addRecipe() {
		const recipe = new Recipe();
		// Object.assign(recipe, this.form.value);
		recipe.titles["en"] = this.form.get("titles")?.value;
		recipe.intro_text["en"] = this.form.get("intro_text")?.value;
		recipe.image = this.imgURL;
		recipe.tags = this.form.get("tags")?.value;
		recipe.preparation_text["en"] = this.form.get("preparation_text")?.value;
		recipe.preparation_time = this.form.get("preparation_time")?.value;
		recipe.additional_text["en"] = this.form.get("video_link")?.value;
		recipe.ingredients["en"] = this.ingredients.value;
		recipe.person_count = this.form.get("person_count")?.value;
		recipe.cooking_type["en"] = this.form.get("cooking_type")?.value;
		if (this.id) {
			recipe.id = this.id;
			db.updateRecipe(recipe).then(number => console.log(number));
		}
		else {
			let id = uuidv4();
			recipe.id = id;
			db.addRecipe(recipe);
		}
		this.form.reset(new Recipe());
		this.location.back();
	}

    /**
     * Removes the image
     */
	public removeImage() {
		this.imgURL = "";
	}

}
