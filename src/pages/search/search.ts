import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Slides,
  Content,
} from "ionic-angular";
import { Tabs } from "ionic-angular/navigation/nav-interfaces";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { DetailsPage } from "../details/details";
import { OmdbDataProvider } from "../../providers/omdb-data/omdb-data";
import { Keyboard } from "ionic-angular/platform/keyboard";
import { Searchbar } from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";
import { Slide } from "ionic-angular/components/slides/slide";

@IonicPage()
@Component({
  selector: "page-search",
  templateUrl: "search.html",
  providers: [OmdbDataProvider],
})
export class SearchPage {
  @ViewChild("Content") content: Content;
  @ViewChild("mySlider") slider: Slides;
  selectedSegment: string = "tv";
  slides: any;

  currentSegment: number;
  curentIndex: number;

  films: any;
  tvs: any;
  tabBarElement: any;
  details: any;
  detailsTV: any;
  sQ: any = ["Search Movies..."];
  sQTV: any = ["Search Tv-series..."];
  pReady = false;

  firstSpeed: number;
  firstCheck: boolean = false;

  placeholder: any = "../../assets/imgs/250.png";

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public omdbService: OmdbDataProvider,
    private keyboard: Keyboard,
    public storageProvider: StorageProvider,
    public loadingCtrl: LoadingController
  ) {
    this.slides = [
      {
        id: "tv",
        title: "Tv Mode",
      },
      {
        id: "movie",
        title: "Movie Mode",
      },
    ];
  }

  onSegmentChanged(segmentButton) {
    let selectedIndex = this.slides.findIndex((slide) => {
      return slide.id == segmentButton.value;
    });

    this.slider.slideTo(selectedIndex);

    if (this.firstCheck == true) {
      this.slider.speed = this.firstSpeed;
    }
  }

  onSlideChanged(slider) {
    let currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide != null) {
      this.selectedSegment = currentSlide.id;
    }
  }

  @ViewChild("searchbar") searchbar: Searchbar;

  //Gömmer tabs under sökning och återställer när man backar
  ionViewWillEnter() {
    this.selectedSegment = this.storageProvider.getModeId();

    if (this.firstCheck == false && this.selectedSegment == "movie") {
      this.firstSpeed = this.slider.speed;
      this.slider.speed = 0;
      this.firstCheck = true;
    }
  }
  ionViewWillLeave() {
    this.storageProvider.setModeId(this.selectedSegment);
  }
  //Ställer markören i sökfältet
  ionViewDidEnter() {
    this.storageProvider.getData("storageList").then((res) => {
      this.films = res;
    });

    this.storageProvider.getData("storageListTV").then((res) => {
      this.tvs = res;
    });

    setTimeout(() => {
      this.searchbar.setFocus();
    });
  }

  checkRemove(i, a) {
    let temp = false;
    for (let y in a) {
      if (a[y].id == i) {
        temp = true;
        break;
      }
    }

    return temp;
  }

  //Öppnar mer info sidan
  openDetails(film, index, more) {
    this.navCtrl.push(DetailsPage, { film: film, index: index, more: more });
  }
  removeFromList(film: any) {
    let temp: any;
    for (let i in this.films) {
      if (this.details[film].id == this.films[i].id) {
        this.storageProvider.removeData(i, "storageList");
      }
    }

    setTimeout(() => {
      this.storageProvider.getData("storageList").then((res) => {
        this.films = res;
      });
    }, 50);
  }

  removeFromListTV(tv: any) {
    let temp: any;
    for (let i in this.tvs) {
      if (this.detailsTV[tv].id == this.tvs[i].id) {
        this.storageProvider.removeData(i, "storageListTV");
      }
    }

    setTimeout(() => {
      this.storageProvider.getData("storageListTV").then((res) => {
        this.tvs = res;
      });
    }, 50);
  }

  openDetailsTV(tv, index, more) {
    this.navCtrl.push(DetailsPage, { tv: tv, index: index, more: more });
  }

  saveToList(film: any, list: string) {
    this.storageProvider.saveData(film, list);

    setTimeout(() => {
      this.storageProvider.getData("storageList").then((res) => {
        this.films = res;
      });

      this.storageProvider.getData("storageListTV").then((res) => {
        this.tvs = res;
      });
    }, 50);
  }

  //Backar knapp under sökning
  back() {
    let last = this.navCtrl.parent.previousTab();
    this.navCtrl.parent.select(last);
  }

  //Hämtar data från API
  getItems(res: any) {
    // Hämta sök sträng
    this.sQ = res.target.value;
    if (!this.sQ || !this.sQ.trim()) {
      this.films = [];
    }

    this.keyboard.close();

    //Hämta data från api genom en provider
    this.omdbService.getSearchRes(this.sQ).subscribe((data) => {
      this.details = data.results;
      if (this.details.poster_path != null) {
        this.placeholder =
          "https://image.tmdb.org/t/p/w500" + this.details.poster_path;
      }
    });
    this.presentLoadingDefault();

    if (this.details) {
      this.pReady = true;
    } else {
      this.pReady = false;
    }
  }

  //Hämtar data från API
  getItemsTV(res: any) {
    // Hämta sök sträng
    this.sQTV = res.target.value;

    if (!this.sQTV || !this.sQTV.trim()) {
      this.tvs = [];
    }

    this.keyboard.close();

    //Hämta data från api genom en provider
    this.omdbService
      .getSearchResTV(this.sQTV)
      .subscribe((data) => (this.detailsTV = data.results));

    this.presentLoadingDefault();

    if (this.detailsTV) {
      this.pReady = true;
    } else {
      this.pReady = false;
    }
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: "Searching...",
      spinner: "bubbles",
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 0);
  }
}
