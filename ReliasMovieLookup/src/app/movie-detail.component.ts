import { Component, OnInit } from '@angular/core';
import { ParamMap, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import 'rxjs/add/operator/switchMap';

import { TmdbService } from './tmdb.service';
import { Movie } from './movie';

@Component({
    selector: 'movie-detail',
    templateUrl: 'movie-detail.component.html',
    styleUrls: ['movie-detail.component.css']
})
export class MovieDetailComponent{
    private movie: Movie;

    constructor(
        private tmdb: TmdbService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    ngOnInit(): void{
        this.route.paramMap //get params from route (url)
        .switchMap( //convert them to observable
            (params: ParamMap) => this.tmdb.getMovieDetails(+params.get('id')))
        .subscribe(movie=> this.movie=movie); //read from observable
    }
    
}