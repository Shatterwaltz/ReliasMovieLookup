import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class TmbdService {
    constructor(private http: Http){}
    api: string = "https://api.themoviedb.org/3/";
    apiKey: string = "55266cd2b84ba9eb48f1b78ffef5eb42";


    getGuestId(): Promise<string>{ //get guest id from tmdb
        return this.http
        .get(`${this.api}/authentication/guest_session/new?api_key=${this.apiKey}`)
        .toPromise()
        .then(response=>response.json().guest_session_id)
        .catch(error=>console.error(error));
    }

}