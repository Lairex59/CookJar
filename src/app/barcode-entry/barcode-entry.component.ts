import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { FoodFact } from "../shared/classes/FoodFact";
import { FoodFactAPI } from "../shared/services/FoodFactAPI";

/**
 * This class is responsible for scanning barcodes and
 * retrieving its information to the user
 */
@Component({
  selector: 'cj-barcode-entry',
  templateUrl: './barcode-entry.component.html',
  styleUrls: ['./barcode-entry.component.scss']
})
export class BarcodeEntryComponent implements OnInit {
    /** ID of the barcode */
	public id!: string;
    /** FoodFact object from the API */
	public fact!: FoodFact;
    /** Possible errors */
	public err!: string;

    /**
     * The constructor injects useful objects
     * @param route The current URL
     * @param food The API manager class
     * @param router For navigation purposes
     */
	constructor(
		private route: ActivatedRoute,
		private food: FoodFactAPI,
		private router: Router
	) { }

    /**
     * This function gets called on class initialisation and it tries to recover
     * the ID from the URL and showcase the FoodFact object
     */
	public ngOnInit(): void {
		this.id = this.route.snapshot.params.id;
		this.food.get_food_fact(this.id).subscribe(data => {
			this.fact = data;
			if (data.product_name === "malformed")
				this.err = "This product is not a food product or does not exist in our API";
		},
		(err) => {
			this.err = "This product is not a food product or does not exist in our API";
		}
		);
	}

    /**
     * When enetering barcode manually, this function submits the code
     * @param number The barcode entered
     */
	public submit(number: string) {
		if (number !== "") {
			let barcode = Number(number);
			let currentUrl = `/barcode/${barcode}`;
			this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
				this.router.navigate([currentUrl]);
			});
		}
		else {
			alert("The barcode number cannot be empty!");
		}
	}

}
