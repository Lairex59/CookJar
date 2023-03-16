import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { from, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import TurndownService from 'turndown';
import { Recipe } from "../classes/Recipe";

/**
 * This class is responsible for calling the OpendataHub API and convert its response
 * to useful Recipe objects
 */
@Injectable({
    providedIn: "root"
})
export class RecipeAPI {
    /** This service is used in the parsing process to parse HTML to Markdown */
    private turndownService = new TurndownService();
    /** This is an array of all supported languages of the OpendataHub API */
    private possible_lang = new Set(['en', 'de', 'it', 'nl', 'pl', 'fr', 'ru', 'sc']);
    /** This is the base URL to which all requests will go */
    private base_api_url = "https://tourism.opendatahub.bz.it/v1/Article";

    /**
     * The constructors injects the necessary HttpClient
     * @param {HttpClient} http Injected HttpClient for API requests
     */
    constructor(private http: HttpClient) { }

    /**
     * Returns all languages
     * @returns {string[]} An array containing all supported languages
     */
    public get_all_languages(): string[] {
        return Array.from(this.possible_lang);
    }

    /**
     * Searches a recipe by a specific ID and optionally specific language
     * @param {string} recipe_id The ID of the recipe
     * @param {string | null} lang Language, by default is empty
     * @returns {Observable} An Observable containing a Recipe object
     */
    public get_recipe(recipe_id: string, lang: string | null = null): Observable<Recipe> {
        if (lang === null) {
            return this.http.get(`${this.base_api_url}/${recipe_id}`)
                .pipe(map(response => this.create_recipe(response)));
        } else if (this.isSubset(new Set(lang), this.possible_lang)) {
            return this.http.get(`${this.base_api_url}/${recipe_id}?language=${lang}`)
                .pipe(map(response => this.create_recipe(response)));
        } else {
            throw new Error(`The language value is wrong, possible values are: ${this.possible_lang}`);
        }
    }

    /**
     * Retrieves all recipes it can find and can optionally filter by a given language
     * @param {string | null} lang Optional language to filter for
     * @returns {Observable} An Observable containing a Recipe object array
     */
    public get_all_recipes(lang: string[] | null = null): Observable<Recipe[]> {
        if (lang === null) {
            return from(this.api_caller(`${this.base_api_url}?articletype=32`)).pipe(map(recipes => recipes));
        } else if (this.isSubset(new Set(lang), this.possible_lang)) {
            const language_params = lang.join("%2C");
            const api_url = `${this.base_api_url}?articletype=32&langfilter=${language_params}`;
            return from(this.api_caller(api_url)).pipe(map(recipes => recipes));
        } else {
            throw new Error(`The language value is wrong, possible values are: ${this.possible_lang}`);
        }
    }

    /**
     * Filters all recipes by array of tags
     * @param {string[]} tags List of tags to search for
     * @returns {Observable} An Observable containing a Recipe object array
     */
    public get_all_recipes_by_tag(tags: string[]): Observable<Recipe[]> {
        const tag_params = tags.join("%2C");
        const api_url: string = `${this.base_api_url}?articletype=32&odhtagfilter=${tag_params}`;
        return from(this.api_caller(api_url)).pipe(map(recipes => recipes));
    }

    /**
     * Filters all recipes by cooking type
     * @param {string} lang The language you selected
     * @param {string} cooking_type The cooking type to filter for
     * @returns {Observable} An Observable containing a Recipe object array
     */
    public get_all_recipes_by_cooking(lang: string, cooking_type: string): Observable<Recipe[]> {
        // rawfilter: and(isnotnull(AdditionalArticleInfos.de.Elements.zutat1), in(AdditionalArticleInfos.de.Elements.zutat1, "olio"))
        const url_prefix = `&rawfilter=and%28isnotnull%28AdditionalArticleInfos.${lang}.Elements.artkueche%29%2C%20in%28AdditionalArticleInfos.${lang}.Elements.artkueche%2C%20%22${cooking_type}%22%29%29`
        return from(this.api_caller(`${this.base_api_url}?articletype=32${url_prefix}`)).pipe(map(recipes => recipes));
    }

    /**
     * Filters all recipes by a given array of ingredients
     * @param {string} lang The selected language
     * @param {string[]} ingredients The array of ingredients to search for
     * @returns {Observable} An Observable containing a Recipe object
     */
    public get_all_recipes_by_ingredients(lang: string, ingredients: string[]): Observable<Recipe[]> {
        const api_url = `${this.base_api_url}?articletype=32&langfilter=${lang}`;
		let array: Recipe[] = [];
        return from(this.api_caller(api_url).pipe(map(recipes => {
            for (const recipe of recipes) {
				if (recipe.api_url !== "") {
					if (this.countMatchingWords(recipe.ingredients[lang], ingredients) >= 1)
						array.push(recipe);
				}
            }
			return array;
        })));
    }

    /**
     * @internal
     * This is a private function that does all the API calls and returns appropriate objects
     * @param api_url URL to execute
     * @returns Depends on API call
     */
    private api_caller(api_url: string): Observable<Recipe[]> {
        // Caching with: https://blog.angulartraining.com/how-to-cache-the-result-of-an-http-request-with-angular-f9aebd33ab3
        return new Observable(observer => {
            const rec_list: Recipe[] = [];

            this.http.get<{ TotalPages: number; TotalResults: number; }>(api_url)
                .pipe(
                    shareReplay(1),
                    map(properties_req => {
                    const total_items = properties_req.TotalResults;

                    // Iterates through all pages
                    this.http.get<{ Items: any[] }>(`${api_url}&pagesize=${total_items}`)
                        .pipe(
                            shareReplay(1),
                            map(recipe_list => {
                            // Iterate through all recipes
                            rec_list.push(...recipe_list.Items.map(this.create_recipe));

                            observer.next(rec_list); // Returning an Observable
                        }))
                        .subscribe();
                }))
                .subscribe();
        });
    }

    /**
     * @internal
     * A private function that transforms JSON objects to Recipe objects
     * @param dirty_json The JSON object string
     * @returns A Recipe object
     */
    private create_recipe = (dirty_json: any): Recipe => {
        const recipe = new Recipe();
        let is_malformed = false;
        const regexForUrl = /(?<=href=["']).*?(?=["'])/g;;
        recipe.id = dirty_json?.Id;
        recipe.api_url = dirty_json?.Self;
        recipe.languages = dirty_json?.HasLanguage;
        recipe.tags = dirty_json?.SmgTags;
        recipe.image_url = dirty_json?.ImageGallery?.ImageUrl;
		if (recipe?.languages)
        for (const lang of recipe?.languages) {
            try {
                const json_detail = dirty_json['Detail'][lang] ?? "";
                recipe.titles[lang] = json_detail['Title'] ?? "";
                if (json_detail['SubHeader'] != "") {
                    recipe.intro_text[lang] = this.cleanText(json_detail['SubHeader']) ?? "";
                } else {
                    recipe.intro_text[lang] = this.cleanText(json_detail['IntroText']) ?? "";
                }
                recipe.additional_text[lang] = json_detail['AdditionalText'].match(regexForUrl) ?? ""; // WARNING! Contains html
                const json_infos = dirty_json['AdditionalArticleInfos'][lang]['Elements'] ?? "";
                recipe.preparation_time = this.cleanText(json_infos['zeit']) ?? "";
                recipe.person_count = json_infos['personen'] ?? "";
                recipe.cooking_type[lang] = json_infos['artkueche'] ?? "";
                recipe.preparation_text[lang] = this.cleanText(json_infos['zubereitungstext']) ?? "";
                recipe.ingredients[lang] = this.create_ingredients(json_infos['zutat1'] ?? ""); // In Markdown format
            } catch (err) {
                console.warn(`The recipe with the ID '${recipe.id}' is malformed`);
                is_malformed = true;
            }
        }
        return is_malformed ? new Recipe() : recipe;
    }

    /**
     * @internal
     * Creates ingredients from a given JSON string
     * @param dirty_html JSON object string
     * @returns An array of string aka. ingredients
     */
    private create_ingredients(dirty_html: string | null): string[] {
        if (!dirty_html) {
            return [];
        }
        const markdown_ing = this.turndownService.turndown(dirty_html);
        // remove empty elements from the list, and remove the leading '- ' from the ingredients
        let ingredient_list = markdown_ing.split("\n").filter(Boolean);
        ingredient_list = ingredient_list.map((ingredient: string) => ingredient.startsWith("-") ? this.cleanText(ingredient.slice(2)) : this.cleanText(ingredient));

        return ingredient_list;
    }

    /**
     * @internal
     * Checks if one set exists in another one
     * @param subset First set
     * @param set Second set
     * @returns True if the set contain eachothers elements, else false
     */
    private isSubset(subset: Set<string>, set: Set<string>): boolean {
        return Array.from(subset).every(element => set.has(element));
    }

    /**
     * @internal
     * Removes special elements, HTML and other stuff from a given string
     * @param dirty_text String you want to clean
     * @returns A clean string
     */
    private cleanText(dirty_text: string): string {
        // Extracted from: https://stackoverflow.com/a/1229594
        if (dirty_text.startsWith("* ")) {
            dirty_text = dirty_text.slice(2);
        }
        dirty_text.replace(/(<([^>]+)>)/gi, "");
		dirty_text = dirty_text.trim();
        var div = document.createElement("div");
        div.innerHTML = dirty_text;
        return div.textContent || div.innerText;
    }

    private countMatchingWords(arr1: string[], arr2: string[]): number {
        let count = 0;
        for (const str2 of arr2) {
          for (const str1 of arr1) {
            if (str2.indexOf(str1) !== -1) {
              count++;
            }
          }
        }
        return count;
      }
}
