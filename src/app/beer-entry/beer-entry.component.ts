import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { BeerAPI } from '../shared/services/BeerAPI';
import { Beer } from '../shared/classes/Beer';

/**
 * Displays a single beer object with all its data
 */
@Component({
  selector: 'cj-beer-entry',
  templateUrl: './beer-entry.component.html',
  styleUrls: ['./beer-entry.component.scss']
})
export class BeerEntryComponent implements OnInit {
    /** The beer object to display */
	public beer?: Beer;

    /**
     * The constructor injects all necessary objects
     * @param beerApi The API to where to get data from
     * @param route The current route
     */
	constructor(
		private beerApi: BeerAPI,
		private route: ActivatedRoute
	) { }

    /**
     * Retrieves the ID from the URL, searches for it withe the API and displays its contents
     */
	public ngOnInit(): void {
		this.beerApi.getBeer(this.route.snapshot.params.id).subscribe((data: Beer) => {
			this.beer = data;
		}, error => alert("API couldn't be reached"));
	}

}
