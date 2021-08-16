import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

let apiKey: string = "##############";

@Injectable()
export class OmdbDataProvider {
  films: any;
  filmQuery: any;
  specifikQuery: any;
  specifik: any;

  constructor(public http: Http) {
    // console.log('Hello OmdbDataProvider Provider');
  }

  getSearchRes(query: any) {
    return this.http
      .get(
        "https://api.themoviedb.org/3/search/movie?api_key=" +
          apiKey +
          "&language=en-US&query=" +
          query +
          "&page=1&include_adult=false"
      )
      .map((res: Response) => res.json());
  }

  getSearchResTV(query: any) {
    return this.http
      .get(
        "https://api.themoviedb.org/3/search/tv?api_key=" +
          apiKey +
          "&language=en-US&query=" +
          query +
          "&page=1"
      )
      .map((res: Response) => res.json());
  }

  getMoreInfo(id: any) {
    return this.http
      .get(
        "https://api.themoviedb.org/3/movie/" +
          id +
          "?api_key=" +
          apiKey +
          "&append_to_response=credits"
      )
      .map((res: Response) => res.json());
  }

  getMoreInfoTV(id: any) {
    return this.http
      .get("https://api.themoviedb.org/3/tv/" + id + "?api_key=" + apiKey)
      .map((res: Response) => res.json());
  }
  getSeason(id: any, season: any) {
    return this.http
      .get(
        "https://api.themoviedb.org/3/tv/" +
          id +
          "/season/" +
          season +
          "?api_key=" +
          apiKey
      )
      .map((res: Response) => res.json());
  }
}
