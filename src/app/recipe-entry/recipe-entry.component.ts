import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Recipe } from "../shared/classes/Recipe";
import { RecipeAPI } from '../shared/services/RecipeAPI';
// import Speech from 'speak-tts';
import { StabilityAPI } from '../shared/services/StabilityAPI';

/**
 * This component holds data from a single recipe in the list
 */
@Component({
  selector: 'cj-recipe-entry',
  templateUrl: './recipe-entry.component.html',
  styleUrls: ['./recipe-entry.component.scss']
})
export class RecipeEntryComponent implements OnInit {
    /** The recipe whose data we use */
	public recipe!: Recipe;
    /** The image in base64 format */
	public imageText: string = "data:image/png;base64, ";
    /** Check if image is loaded */
	public imageLoaded = true;
    /** Saves the button state */
	public buttonClicked = false;
    /** A list of ingredients */
	public ingredient: readonly any[] = [""];

	// private speech = new Speech(); // will throw an exception if not browser supported

    /**
     * The constructor injects needed objects
     * @param route for navigation
     * @param recipeApi for data retrieval
     * @param image for image generation
     */
	constructor(
		private route: ActivatedRoute,
		private recipeApi: RecipeAPI,
		private image: StabilityAPI
	) { }

    /**
     * Ability to export the recipe in PDF format (is a bit ugly sorry)
     */
	public generatePDF() {
		const data = document.getElementById('recipeContainer');
		html2canvas(data!).then((canvas: any) => {
			const imgWidth = 208;
			const imgHeight = canvas.height * imgWidth / canvas.width;
			const contentDataURL = canvas.toDataURL('image/png');
			let pdf = new jsPDF('p', 'mm', 'a4');
			pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
			pdf.save('recipe.pdf');
		});
	}

    /**
     * Initialises the component by retrieving the recipe data from the API
     */
	public ngOnInit(): void {
		this.recipeApi.get_recipe(this.route?.snapshot?.params?.id).subscribe(recipe => {
			this.recipe = recipe;
		}, error => alert("API couldn't be reached"));
	}

    /**
     * Generates the image of the recipe on demand
     */
	public generateImage() {
		// If you wnat to generate image: uncomment next 3 lines. currently commented out as to not too many api requests while testing other things
		this.imageLoaded = false;
		this.buttonClicked = true;
		this.image.getImage(this.recipe.titles[this.route.snapshot.params.lang]).then(image => {
			this.imageText += image.artifacts[0].base64;
			this.imageLoaded = true;
			this.buttonClicked = false;
		}, error => alert("API couldn't be reached"));
	}

    /**
     * Getter to retrieve language of given recipe
     */
	public get lang(): string {
		return this.route.snapshot.params.lang
	}

    /**
     * Parses the ingredient text
     * @param ingredient Single ingredient
     * @returns a clean ingredient
     */
	public removeStarsInIngreidents(ingredient: string) {
		return ingredient.replace(/\*\*/g, " ");
	}

}
