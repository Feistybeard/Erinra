import { Component, ViewChild, OnInit, Input } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Http, Response } from "@angular/http";
import { Tabs } from "ionic-angular/navigation/nav-interfaces";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { OmdbDataProvider } from "../../providers/omdb-data/omdb-data";
import { StorageProvider } from "../../providers/storage/storage";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: "page-details",
  templateUrl: "details.html",
  // styleUrls: ['details.scss']
})
export class DetailsPage {
  @Input() myObject: any;

  film: any; //Info från SearchPage
  imdb: any; //Id till IMDB
  films: any; // Info om specifik film
  filmInfo: any;

  details: any;
  detail: any;
  i: any;

  check: any;

  placeholder: any = "../../assets/imgs/350.png";
  constructor(
    private sanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public omdbService: OmdbDataProvider,
    public storageProvider: StorageProvider
  ) {
    this.check = this.navParams.get("more");

    //  TV --------
    if (this.check == 0) {
      this.film = this.navParams.get("tv");
      this.omdbService.getMoreInfoTV(this.film.id).subscribe((data) => {
        this.filmInfo = data;
        if (this.filmInfo.backdrop_path != null) {
          this.placeholder =
            "https://image.tmdb.org/t/p/w500" + this.filmInfo.backdrop_path;
        }
      });
    }
    // FILM -------
    else if (this.check == 1) {
      this.film = this.navParams.get("film");
      this.omdbService.getMoreInfo(this.film.id).subscribe((data) => {
        this.filmInfo = data;
        if (this.filmInfo.backdrop_path != null) {
          this.placeholder =
            "https://image.tmdb.org/t/p/w500" + this.filmInfo.backdrop_path;
        }
      });
      console.log(this.filmInfo);
    }
    this.i = this.navParams.get("index");
  }

  ngOnInit() {}

  removeFromList(film: any) {
    this.storageProvider.removeData(film, "storageList");
    this.navCtrl.pop();
  }
  removeFromListTV(film: any) {
    this.storageProvider.removeData(film, "storageListTV");
    this.navCtrl.pop();
  }
  ionViewDidLoad() {}
}
