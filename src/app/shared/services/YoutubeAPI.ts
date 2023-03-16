import { map, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

/**
 * This class is responsible to search for Youtube videos for a recipe
 */
@Injectable({
	providedIn: "root"
})
export class YoutbeAPI {
    /** The URL to make APi calls to */
	private API_URL: string = "https://www.googleapis.com/youtube/v3/search";
    /** The Key for the API calls */
	private API_KEY: string = environment.YT_API_KEY;

    /**
     * The constructors injects the necessary HttpClient
     * @param {HttpClient} http Injected HttpClient for API requests
     */
	constructor(private http: HttpClient) { }

    /**
     * Returns the first video it finds for a given query
     * @param query The query to execute on YouTube
     * @returns An Observable
     */
	getVideos(query: string): Observable<any> {
		query += " recipe tutorial";
		const url = `${this.API_URL}?q=${query}&key=${this.API_KEY}&part=snippet&type=video&maxResults=1`;
		return this.http.get(url)
		  .pipe(
			map((response: any) => response.items)
		  );
	}

}
