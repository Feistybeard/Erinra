import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  Slides,
  Content,
} from "ionic-angular";
import { StorageProvider } from "../../providers/storage/storage";
import { DetailsPage } from "../details/details";
import { compareDates } from "ionic-angular/util/datetime-util";
import * as moment from "moment";
import { Slide } from "ionic-angular/components/slides/slide";
import { OmdbDataProvider } from "../../providers/omdb-data/omdb-data";
import "rxjs/add/operator/map";
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
@IonicPage()
@Component({
  selector: "page-upcoming",
  templateUrl: "upcoming.html",
})
export class UpcomingPage {
  @ViewChild(Content) content: Content;
  @ViewChild("mySlider") slider: Slides;
  mode: any;
  selectedSegment: string;
  slides: any;

  upcomingTv = [];
  sortedByDate = [];
  tempTV: any;
  items: any;
  itemsTV: any;
  currentSegment: number;
  curentIndex: number;

  previousTV = new Date();
  daysLeft = new Date();

  year = new Date();

  sortedByYear = [];
  sortedByYearTV = [];

  week: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageProvider: StorageProvider,
    public omdbService: OmdbDataProvider,
    public http: Http
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
  }

  onSlideChanged(slider) {
    let currentSlide = this.slides[slider.getActiveIndex()];
    if (currentSlide != null) {
      this.selectedSegment = currentSlide.id;
    }
  }

  ionViewWillEnter() {
    this.selectedSegment = this.storageProvider.getModeId();

    this.week = this.nextDate(this.year.getDay());
  }

  ionViewDidEnter() {
    this.sortedByYear = [];
    this.storageProvider.getData("storageList").then((res) => {
      this.items = res;
      //console.log("items är: " + this.items);
      this.groupByDate(this.items);
      //console.log("items är efter: " + this.items);
    });

    this.itemsTV = [];
    this.storageProvider.getData("storageListTV").then((res) => {
      this.itemsTV = res;
      this.getEpisodeName(this.itemsTV);
      setTimeout(() => {
        this.sortedByDate = [];
        this.groupByDateTV();
      }, 500);
      //console.log(this.upcomingTv);
    });
  }

  groupByDateTV() {
    let currentFilmDate = this.year.getDate() - 1;
    let currentContacts = [];
    let sortDate: any;
    let check = false;
    for (let i of this.upcomingTv) {
      let tempDate = new Date(i.air_date.toString());
      if (tempDate.getDate() != currentFilmDate) {
        currentFilmDate = tempDate.getDate();

        let tempMoment = moment(tempDate.toString());
        sortDate = tempMoment.format("dddd");
        if (tempMoment.isSameOrAfter(this.week, "day") && check == false) {
          sortDate = "Later ";
          check = true;
          let newGroup = {
            sortedBy: sortDate,
            tvs: [],
          };
          currentContacts = newGroup.tvs;
          this.sortedByDate.push(newGroup);
        } else if (check == false) {
          let newGroup = {
            sortedBy: sortDate,
            tvs: [],
          };
          currentContacts = newGroup.tvs;
          this.sortedByDate.push(newGroup);
        }
      }
      currentContacts.push(i);
    }
  }

  pad(str, max) {
    return str.length < max ? this.pad("0" + str, max) : str;
  }

  nextDate(dayIndex) {
    var today = new Date();
    today.setDate(
      today.getDate() + ((dayIndex - 1 - today.getDay() + 7) % 7) + 1
    );
    return today;
  }

  getEpisodeName(tv) {
    if (tv != null) {
      for (let i of tv) {
        let tempInfo: any;
        this.omdbService.getMoreInfoTV(i.id).subscribe((data) => {
          tempInfo = data;
          this.omdbService
            .getSeason(i.id, tempInfo.number_of_seasons)
            .subscribe((data) => {
              for (let y of data.episodes) {
                if (y.air_date != null) {
                  let tempDateObject = moment(y.air_date.toString());
                  let tempMoment = moment(this.year);

                  if (tempDateObject.isSameOrAfter(tempMoment, "day")) {
                    y.seriename = i.name;
                    y.poster_path = i.poster_path;
                    this.upcomingTv.push(y);
                    break;
                  }
                }
              }
              if (this.upcomingTv) {
                this.upcomingTv.sort(function (a, b) {
                  if (a.air_date > b.air_date) return 1;
                  else return -1;
                });
              }
            });
        });
      }
    }

    return true;
  }

  sortArray(ar) {
    let leng = ar.length;

    for (let i of ar) {
      let tempDateObject = new Date(i.last_air_date.toString());
      //console.log(tempDateObject);
      if (tempDateObject < this.year) {
        //console.log("Tog bort: ",i.name);
        this.upcomingTv.splice(i, 1);
        //console.log(this.upcomingTv);
      }
    }
  }

  ionViewWillLeave() {
    this.storageProvider.setModeId(this.selectedSegment);
    this.upcomingTv = [];
  }

  getReleaseDif(date: any) {
    let temp = moment(date.release_date.toString());
    return temp.diff(moment(this.year.toString()), "days");
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if (currentIndex == 0) {
      this.mode = "1";
    } else {
      this.mode = "2";
    }
  }

  convertDate(a) {
    return new Date(a.release_date.toString()) > this.year;
  }

  groupByDate(films) {
    if (films != null) {
      let currentYear = this.year.getFullYear();
      let currentFilmYear = this.year.getFullYear();
      let currentFilmMonth = this.year.getMonth() - 1;
      let currentContacts = [];
      for (let i of films) {
        let tempDateObject = new Date(i.release_date.toString());

        if (
          tempDateObject > this.year &&
          tempDateObject.getFullYear() < currentYear + 1
        ) {
          if (tempDateObject.getMonth() > currentFilmMonth) {
            currentFilmMonth = tempDateObject.getMonth();

            let newGroup = {
              sortedBy: moment(tempDateObject.toString()).format("MMMM"),
              films: [],
            };

            currentContacts = newGroup.films;
            this.sortedByYear.push(newGroup);
          }
        } else if (tempDateObject.getFullYear() > currentFilmYear) {
          currentFilmYear = tempDateObject.getFullYear();
          let newGroup = {
            sortedBy: currentFilmYear,
            films: [],
          };

          currentContacts = newGroup.films;
          this.sortedByYear.push(newGroup);
        }
        currentContacts.push(i);
      }
    }
  }
  openDetails(film, index) {
    this.navCtrl.push(DetailsPage, { film: film, index: index });
  }
}
