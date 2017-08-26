import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Movie } from './movie';
import { TmdbService } from './tmdb.service';

@Component({
    selector: 'movie-search',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})
export class MovieSearchComponent implements OnInit{
  /*uses an observable, letting me cancel search requests.
  Useful because this will search as the user types, so search terms 
  will change very rapidly. */
  private movies: Observable<Movie[]>;
  private searchTerms = new Subject<string>();
  private selectedMovie: Movie;

  constructor(private tmdb: TmdbService){}
            
  ngOnInit(): void{

    this.movies=this.searchTerms
    .debounceTime(200) //wait when terms change
    .distinctUntilChanged() //dont resend if terms havent changed
    .switchMap(term => term //use new observable when terms change
      ? this.tmdb.search(term) //if term isn't empty, search it
      : Observable.of<Movie[]>([])) //otherwise, return an empty observable
    .catch(error=>{
      console.log(error);
      return Observable.of<Movie[]>([]); //on error, log and return empty observable
    })
  }

  //send new term to searchTerms
  search(term: string): void {
    this.searchTerms.next(term);
  }

  onSelect(movie:Movie): void{
    if(this.selectedMovie===movie){
      this.selectedMovie=null;
    }else{
      this.selectedMovie=movie;
    }
  }
}