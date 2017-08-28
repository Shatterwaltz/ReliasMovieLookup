import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { Movie } from './movie';

@Injectable()
export class TmdbService {
    constructor(private http: Http){}
    api: string = "https://api.themoviedb.org/3"; //beginning of api url
    apiKey: string = "55266cd2b84ba9eb48f1b78ffef5eb42"; //my api key
    
    //perform search with tmdb's api. If no page specified, grab
    //first page of results. 
    search(term: string, page:number=1): Observable<Movie[]>{
        return this.http
        .get(`${this.api}/search/movie?api_key=${this.apiKey}&query=${term}&page=${page}`) //api movie search
        .map(response=>response.json().results as Movie[])
        .catch(error=>{
      console.log(error);
      return Observable.of<Movie[]>([]); //on error, log and return empty observable
    }); 
    }

    getPageCount(term: string): Observable<number>{
        return this.http.get(`${this.api}/search/movie?api_key=${this.apiKey}&query=${term}`)
        .map(response=>response.json().total_pages as number)
        .catch(error=>{
      console.log(error);
      return Observable.of<number>(); 
    });
    }

    getMovieDetails(id: number): Promise<Movie>{
        return this.http.get(
            `${this.api}/movie/${id}?api_key=${this.apiKey}`
        )
        .toPromise()
        .then(response=>response.json() as Movie)
        .catch(error=>{
            console.error(error);
            return Promise.reject(error); })
    }
}