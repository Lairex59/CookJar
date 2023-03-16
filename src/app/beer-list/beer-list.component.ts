import { BeerAPI } from './../shared/services/BeerAPI';
import { Component, OnInit } from '@angular/core';
import { Beer } from "../shared/classes/Beer";

/**
 * This class showcases all beer in a list
 */
@Component({
  selector: 'cj-beer-list',
  templateUrl: './beer-list.component.html',
  styleUrls: ['./beer-list.component.scss']
})
export class BeerListComponent implements OnInit {
    /** Checks if all beers have loaded */
	public resourcesLoaded: boolean = false;
    /** Saves the list of beers */
	public beerList: Beer[] = [];
    /** Caches the list of beers */
	public beerListCache: Beer[] = [];

    /**
     * Injects the API
     * @param beerApi Beer API for data retrieval
     */
	constructor(
		public beerApi: BeerAPI
	) { }

    /**
     * Retrieves all beer through the API and sets the class variables
     */
	public ngOnInit() {
		this.beerApi.getAllBeer().subscribe(data => {
			this.resourcesLoaded = false;
			this.beerList = data;
			this.beerListCache = data;
			this.resourcesLoaded = true;
		}, error => alert("API couldn't be reached"));
	}

    /**
     * Allows the user to filter the beer by a specific search term
     * @param search Search term
     */
	public filterBeer(search: string) {
		this.resourcesLoaded = false;
		if (search === "") {
			this.beerList = this.beerListCache;
			this.resourcesLoaded = true;
		}
		else  {
			this.beerList = this.beerList.filter((data: Beer) => {
				const title: string = data.name;
				if (title)
					return title.toLowerCase().includes(search.toLowerCase());
				return false;
			});
			this.resourcesLoaded = true;
		}
	}
}
