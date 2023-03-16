import { db } from './../shared/classes/Database';
import { Component, OnInit } from '@angular/core';
import { Recipe } from "../shared/classes/Recipe";
import { StabilityAPI } from '../shared/services/StabilityAPI';
import { YoutbeAPI } from "../shared/services/YoutubeAPI";

/** This is a interface for the YouTube Video service */
export interface Video {
	/** ID of the YouTube video */
	videoId: string;
	/** URL of the YouTube video */
	videoUrl: string;
	/** Title of the YouTube video */
	title: string;
	/** Thumbnail of the YouTube video */
	thumbnail: string;
  }

/**
 * This component showcases your own recipes that are locally saved
 */
@Component({
  selector: 'cj-your-recipe-list',
  templateUrl: './your-recipe-list.component.html',
  styleUrls: ['./your-recipe-list.component.scss']
})
export class YourRecipeListComponent implements OnInit {
    /** Local list of recipes */
	public recipeList: Recipe[] = [];
    /** Cached list of recipes */
	public recipeListCache!: Recipe[];
    /** Checks if resources have been loaded */
	public resourcesLoaded: boolean = false;
	/** Local video of recipe video */
	public videoYt?: Video[];
    /** A single recipe ID */
	public recipe_id = "";
    /** Check if image is loaded */
	public imageLoaded = true;
    /** Saves the button state */
	public buttonClicked = false;
    /** Checks if the AI is loaded */
	public aiLoaded = true;

    /**
     * Injects important objects
     * @param image for generating images
     * @param video for generating YouTube videos
     */
	constructor(
		private image: StabilityAPI,
		private video: YoutbeAPI
	) { }

    /**
     * Initialises the component by loading the list from the database
     */
	public ngOnInit(): void {
		db.getAllRecipe().then(data => {
			this.recipeList = data;
			this.recipeListCache = data;
			this.resourcesLoaded = true;
		});
	}

    /**
     * Clears the entire list of favorites
     */
	public removeAll() {
		if (confirm('Are you sure to DELETE ALL Recipes?')) {
			// Save it!
			db.deleteAllRecipes();
			this.recipeList = [];
			this.recipeListCache = [];
		  } else {
			// Do nothing!
		  }
	}

    /**
     * Removes a single recipe from the database
     * @param remove Recipe to remove
     */
	public remove(remove: Recipe) {
		if (confirm('Are you sure to DELETE ' + remove.titles["en"] + " Recipe?")) {
			db.deleteRecipe(remove.id);
			if (this.recipeList)
				this.recipeList.forEach((element, index) => {
					if (element === remove && this.recipeList)
						delete this.recipeList[index];
				});
		  } else {
			// Do nothing!
		  }
	}

    /**
     * Generates a recipe using AI technology and a given prompt
     * @param search Prompt for generation
     */
	public generateAI(search: string) {
		if (search !== "") {
			this.buttonClicked = true;
			this.aiLoaded = false;
			this.image.generateRecipe(search).then(data => data.json().then(async data => {
				console.log(data.message);
				let recipe = this.image.parseRecipe(data.message);
				await db.addRecipe(recipe);
				db.getAllRecipe().then(data => {
					let temp1!: Recipe;
					let temp1Index!: number;
					for (let i = 0; i < data.length; i++) {
						if (data[i].id === recipe.id) {
							temp1 = data[i];
							temp1Index = i;
						}
					}
					const temp = data[0];
					console.log(temp)
					data[0] = temp1;
					data[temp1Index] = temp;
					this.recipeList = data;
				});
				this.aiLoaded = true;
				this.buttonClicked = false;
			}, error => alert("API couldn't be reached")));
		} else {
			alert("The recipe name cannot be empty");
		}
	}

    /**
     * Generates an image for a recipe using AI
     * @param recipe The Recipe you need the image for
     */
	public generateImage(recipe: Recipe) {
		this.recipe_id = recipe.id;
		this.imageLoaded = false;
		this.buttonClicked = true;
		this.image.getImage(recipe.titles["en"]).then(data => {
			recipe.image = "data:image/png;base64, " + data.artifacts[0].base64;
			db.updateRecipe(recipe);
			this.imageLoaded = true;
			this.buttonClicked = false;
		}, error => alert("API couldn't be reached"));
	}

	/**
     * Generates a YouTube video for a recipe using the YouTube API
     * @param recipe The Recipe you need the video for
     */
	public generateVideo(recipe: Recipe) {
		this.video.getVideos("how to make " + recipe.titles["en"]).subscribe(items => {
			this.videoYt = items.map(item => {
				return {
					title: item.snippet.title,
					videoId: item.id.videoId,
					videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
					thumbnail: item.snippet.thumbnails.high.url
				  };

			});
			recipe.additional_text["en"] = this.videoYt![0].videoUrl ?? "";
			if (recipe.additional_text["en"] !== "")
				db.updateRecipe(recipe);
			console.log(recipe.additional_text);
			if (confirm("Do you want to visit the video?")) {
				window.location.href = recipe.additional_text["en"];
			}
		}, error => alert("API couldn't be reached"));
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
}
