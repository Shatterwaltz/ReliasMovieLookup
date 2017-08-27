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
  private page=1;
  private totalPages: Observable<number>;
  
  constructor(private tmdb: TmdbService){}
            
  //TODO: figure out how to trigger new search on change of this.page
  ngOnInit(): void{
    //get updated movie list
    this.movies=this.searchTerms
    .debounceTime(200) //wait when terms change
    .distinctUntilChanged() //dont grab duplicates from terms
    .switchMap(term => term //use new observable when terms change
      ? this.tmdb.search(term, this.page) //if term isn't empty, search it
      : Observable.of<Movie[]>([])) //otherwise, return an empty observable
    .catch(error=>{
      console.log(error);
      return Observable.of<Movie[]>([]); //on error, log and return empty observable
    });

    //get updated page count
    this.totalPages=this.searchTerms
    .debounceTime(200) //wait when terms change
    .distinctUntilChanged() //dont grab duplicates from terms
    .switchMap(term => term //use new observable when terms change
      ? this.tmdb.getPageCount(term) //if term isn't empty, search it
      : Observable.of<number>()) //otherwise, return an empty observable
    .catch(error=>{
      console.log(error);
      return Observable.of<number>(); //on error, log and return empty observable
    });
  }

  //send new term to searchTerms
  search(term: string, page=1): void {
    this.searchTerms.next(term);
    this.page=page;
    console.log(page);
  }

  onSelect(movie:Movie): void{
    if(this.selectedMovie===movie){
      this.selectedMovie=null;
    }else{
      this.selectedMovie=movie;
    }
  }
}