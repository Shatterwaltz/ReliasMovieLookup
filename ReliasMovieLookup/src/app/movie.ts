export class Movie {
    id: number;
    title: string;
    overview: string;
    genres: {id:number, name: string}[];
    runtime: number;
    vote_average: number;
    vote_count: number;
    release_date: string;
}