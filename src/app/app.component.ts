import { MyCookieService } from './shared/services/cookie.service';
import { MediaMatcher } from "@angular/cdk/layout";
import { OnDestroy, ViewChild } from "@angular/core";
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import { RecipeAPI } from "./shared/services/RecipeAPI";
import { db } from "./shared/classes/Database";
import { BarcodeScannerLivestreamOverlayComponent } from "ngx-barcode-scanner";

/**
 * This is the main entry point of the Angular application
 */
@Component({
  selector: 'cj-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    /** Stores information on a media query applied to a document */
	mobileQuery: MediaQueryList;
    /** Holds the greeting text */
	public greetingTextBig: string = "";
    /** Holds the greeting sub text */
	public greetingTextSmall: string = "";
    /** Saves the date */
	public date = new Date();
    /** Needed for barcode scanning */
	@ViewChild(BarcodeScannerLivestreamOverlayComponent, { static: true })
	barecodeScannerOverlay!: BarcodeScannerLivestreamOverlayComponent;
    /** Saves the barcode value */
	barcodeValue!: string;

    /**
     * The constructor injects important objects
     * @param router for navigation
     * @param location for current location
     * @param changeDetectorRef for changes detection
     * @param media for media matching
     * @param cookieService for cookies
     * @param recipeApi for recipe API calls
     */
	constructor(
		public router: Router,
		private location: Location,
		changeDetectorRef: ChangeDetectorRef,
		media: MediaMatcher,
		private cookieService: MyCookieService,
		private recipeApi: RecipeAPI,
		// private db: DbService,
	) {
		this.mobileQuery = media.matchMedia('(max-width: 600px)');
		this._mobileQueryListener = () => changeDetectorRef.detectChanges();
		this.mobileQuery.addListener(this._mobileQueryListener);
	}
    /** Starts the barcode scanner overlay */
	startBarecodeScannerOverlay() {
		this.barecodeScannerOverlay.show();
	}

    /**
     * Checks if the barcode scanned something
     * @param result variable to observe
     */
	onValueChanges(result) {
		this.barcodeValue = result.codeResult.code;
		this.barecodeScannerOverlay.hide();
		if (!this.router.url.startsWith("/barcode"))
			this.router.navigate([`/barcode/${this.barcodeValue}`]);
		else
			this.router.navigate([`/barcode/${this.barcodeValue}`]).then(() => window.location.reload());
	}

    /**
     * Initialises component and inserts its contents
     */
	public ngOnInit(): void {
		this.greetingTextBig = this.greeting();
		this.greetingTextSmall = this.greetingsSmall();
		if (!this.cookieService.checkCookie("daily"))
			this.recipeApi.get_all_recipes(["en"]).subscribe(recipes => {
				for (let recipe of recipes) {
					let number: number = this.getRandomInt(20);
					if (recipe.id !== "" && number === 10 && recipe.api_url !== "") {
						const newDate = new Date();
						const subDate = newDate.getHours() * 3600 + newDate.getMinutes() * 60 + newDate.getSeconds();
						this.cookieService.setCookie("daily", recipe.id, 86_400 - subDate);
					}
				}

			});
	}

    /**
     * Actions to perform when the app is closed
     */
	public ngOnDestroy(): void {
		this.mobileQuery.removeListener(this._mobileQueryListener);
	}

    /** Listener for queries */
	private _mobileQueryListener: () => void;

    /**
     * Contains the greeting texts and returns them depending on the day
     * @returns greeting of the day
     */
	public greeting(): string {
		switch(this.date.getDay()) {
			case 0: {
				const greetings = [
					"Weekend's over. Did you do your homework?",
					"Sundays be just a presequel to Monday",
					"Enjoy the last hours before Monday",
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 1: {
				const greetings = [
					"Every day is a gift (even Monday). Have a great week!",
					"Have a great Monday, if such a thing is possible",
					"A Monday with you is better than a Saturday with anyone else",
					"Long time no see soldier. Weekend was sure lit"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 2: {
				const greetings = [
					"Tuesday merely means that you made it through Monday",
					"If things go wrong, don’t worry. You have Wednesday to correct it",
					"Everybody hates Monday, but it’s over now. Happy Tuesday fella"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 3: {
				const greetings = [
					"Greetings, Wednesday! The weekend will arrive in two more days",
					"I'm wishing you the best this Wednesday! Enjoy your wonderful day",
					"Wednesday- “not as boring” as Monday and “not as exciting as Friday”",
					"Can you see the weekend from here?"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 4: {
				const greetings = [
					"The most useless day of the week is Thursday.",
					"Hello friend, enjoy the Friday. My bad, I was just practicing for tomorrow",
					"Thursday come, and the week’s gone"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 5: {
				const greetings = [
					"Weekends would be less if Friday didn’t exist. Happy Friday, everyone!",
					"Friday afternoon feels like heaven…",
					"IT'S FRIDAY!"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 6: {
				const greetings = [
					"Have a lovely lonely weekend!",
					"Relax it's saturday",
					"What a nice smile you got on saturday"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			default: {
				return "CookJar"
			}
		}
	}

    /**
     * A smaller greeting text dependent of the current day
     * @returns todays greeting
     */
	public greetingsSmall(): string {
		const date = new Date().getDay();
		switch(date) {
			case 0: {
				const greetings = [
					"What a sunny day",
					"Welcome to Sunday",
					"Hello, it's Sunday",
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 1: {
				const greetings = [
					"Here is your Monday coffe",
					"Monday's lame",
					"Go away Monday"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 2: {
				const greetings = [
					"It's no more Monday",
					"How bad can today be?",
					"Welcome Tuesday"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 3: {
				const greetings = [
					"Ah yes almost weekend",
					"What?! Wednesday!",
					"Wednesday be ruining the mood",
					"It's mid week :)"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 4: {
				const greetings = [
					"Useless day, Thrusday",
					"1 day till Friday",
					"Just run away Thursday"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 5: {
				const greetings = [
					"Almost weekend, Friday",
					"Hang in there a few hours",
					"IT'S FRIDAY!"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			case 6: {
				const greetings = [
					"Have a lovely lonely weekend!",
					"Relax it's saturday",
					"Touch some grass"
				];
				return greetings[this.getRandomInt(greetings.length)];
			}
			default: {
				return "CookJar"
			}
		}
	}

    /**
     * Returns a random integer
     * @param max highest range
     * @returns a random number below max
     */
	public getRandomInt(max: number): number {
		return Math.floor(Math.random() * max);
	}

    /**
     * Allows the user to export the database
     * @returns if the action succeeded
     */
	public exportDatabase() {
		return db.exportDatabase();
	}

    /**
     * Imports the database from a file
     */
	public importDatabase() {
		document.querySelector('input')?.click()
	}

    /**
     * Handles given events or actions
     * @param e Event or action
     */
	public async handle(e: any){
		if (confirm('In order to import the selected databse, your current databse will be permanently deleted and cannot be restored. Are you sure want to continue?')) {
			// Save it!
			try {
				await db.deleteAllRecipes();
				db.importDatabase(e.target.files[0]);
				window.location.reload();
			} catch(e) {

			}
		  } else {
			// Do nothing!
		  }
	}

    /**
     * Allows the user to go back
     */
	public goBack(): void {
		this.location.back();
	}
}
