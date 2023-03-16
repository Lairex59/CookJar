import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

/**
 * This class is responsible to generate a cookie for each user that uses the app.
 * The cookie will remain active for about 24 hours and hold the daily recipe
 */
@Injectable({
  providedIn: 'root'
})
export class MyCookieService {

    /**
     * The constructor injects the necessary service
     * @param cookieService The injected service
     */
	constructor(private cookieService: CookieService) { }

    /**
     * Sets the cookie with all its parameters
     * @param name Name of the cookie
     * @param value Value of the cookie
     * @param expires Expiration time
     */
	public setCookie(name: string, value: string, expires: number) {
		const now = new Date();
		const cookieExpires = new Date(now.getTime() + expires * 1000);
		console.log(JSON.stringify(value));
		this.cookieService.set(name, JSON.stringify(value).replaceAll('"', "").toString(), cookieExpires);
	}

    /**
     * Checks the status of a cookie by its name
     * @param name Name of the cookie
     * @returns True if the cookie is available
     */
	public checkCookie(name: string) {
		return this.cookieService.check(name);
	}

    /**
     * Retrives the cookie by its name
     * @param name Name of the cookie
     * @returns A string representing the cookie
     */
	public getCookie(name: string) {
		return this.cookieService.get(name);
	}
}
