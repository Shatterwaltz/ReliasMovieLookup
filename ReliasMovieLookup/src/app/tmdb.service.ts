import { Injectable } from '@angular/core';
import { Headers, Http }       from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Movie } from './movie';

@Injectable()
export class TmbdService {
    constructor(private http: Http){}
    api: string = "https://api.themoviedb.org/3";
    apiKey: string = "55266cd2b84ba9eb48f1b78ffef5eb42";


    getGuestId(): Promise<string>{ //get guest id from tmdb
        return this.http
        .get(`${this.api}/authentication/guest_session/new?api_key=${this.apiKey}`)
        .toPromise()
        .then(response=>response.json().guest_session_id as string)
        .catch(error=>Promise.reject(error));
    }

    search(term: string): Promise<Movie[]>{
        return this.http
        .get(`${this.api}/search/movie?api_key=${this.apiKey}&query=${term}`)
        .toPromise()
        .then(response=>response.json().results as Movie[])
        .catch(error=>Promise.reject(error));

    }

}