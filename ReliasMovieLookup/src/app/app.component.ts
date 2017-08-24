import { Component, OnInit } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Movie } from './movie';
import { TmbdService } from './tmdb.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'Flick Finder';
  movies: Movie[];
   /*There's still a window of time after ngOnInit
     that promise of guest id is unfulfilled and
     guestID is null. Is there a good way to handle this
     or do I just have to check everywhere to make sure
     it's not null?
     Do I make guestID a promise instead and throw .then()
     everywhere?
     For now, I'm going to have the search function just not do anything
     unless the id is ready*/

  guestID: string;

  constructor(private http: Http,
              private tmdb: TmbdService){}
  
  //get guest session id on load            
  ngOnInit(): void{
    this.tmdb.getGuestId()
      .then((result=>this.guestID=result))
      .catch(error=>Promise.reject(error));
  }

  //grab first page of movie results
  search(term: string): void {
    if(this.guestID&&term){//don't try to search until guestID is fetched
      this.tmdb.search(term).then(movies=>this.movies = movies);
    } else{
      this.movies=[];
    }
  }
}
