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

  private guestID: string;
  private searchTerms = new Subject<string>();


  constructor(private http: Http,
              private tmdb: TmbdService){}
  
  //get guest session id on load            
  ngOnInit(): void{
    this.tmdb.getGuestId()
      .then((result=>this.guestID=result))
      .catch(error=>Promise.reject(error));

    this.movies=this.searchTerms
    .debounceTime(300)
    .distinctUntilChanged()
    .switchMap(term => term
      ? this.tmdb.search(term)
      : Observable.of<Movie[]>([]))
    .catch(error=>{
      console.log(error);
      return Observable.of<Movie[]>([]);
    })
  }

  //grab first page of movie results
  search(term: string): void {
    this.searchTerms.next(term);
  }
}
