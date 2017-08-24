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
  
   //There's still a window of time after ngOnInit
   //that promise of guest id is unfulfilled and
   //guestID is null. Is there a good way to handle this
   //or do I just have to check everywhere to make sure
   //it's not null?
   //Do I make guestID a promise instead and throw .then()
   //everywhere?
  guestID: string;

  constructor(private http: Http,
              private tmdb: TmbdService){}
  
  ngOnInit(): void{ //get guest session id on load
    this.tmdb.getGuestId()
      .then((result=>this.guestID=result))
      .catch(error=>console.error(error));
  }

  search(): Movie[] {
        //TODO: search functionality, put it in tmdb service.
        console.log(this.guestID);
        return [];
    
  }
}
