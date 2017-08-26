import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { MovieDetailComponent } from './movie-detail.component';
import { TmdbService }  from './tmdb.service';
import { MovieSearchComponent } from './search.component'

@NgModule({
  declarations: [
    AppComponent,
    MovieSearchComponent,
    MovieDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: '', //Set base url tp redirect to /search
        redirectTo: '/search',
        pathMatch: 'full'
      },
      {
        path:'search', //Set AppComponent to load at */search url
        component: MovieSearchComponent
      },
      {
        path: 'detail/:id', //Navigation to detail component
        component: MovieDetailComponent
      }
    ])
  ],
  providers: [TmdbService],
  bootstrap: [AppComponent]
})
export class AppModule { }
