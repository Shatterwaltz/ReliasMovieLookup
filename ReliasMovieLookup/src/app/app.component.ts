import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject }    from 'rxjs/Subject';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Movie } from './movie';
import { TmbdService } from './tmdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  private title = 'Flick Finder';

  /*uses an observable, letting me cancel search requests.
  Useful because this will search as the user types, so search terms 
  will change very rapidly. */
  private movies: Observable<Movie[]>;
   /*There's still a window of time after ngOnInit
     that promise of guest id is unfulfilled and
     guestID is null. Is there a good way to handle this
     or do I just have to check everywhere to make sure
     it's not null?
     Do I make guestID a promise instead and throw .then()
     everywhere?
     For now, I'm going to have the search function just not do anything
     unless the id is ready*/

  private searchTerms = new Subject<string>();


  constructor(private http: Http,
              private tmdb: TmbdService){}
  
  //get guest session id on load            
  ngOnInit(): void{
    //fetch guest session id


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
}
