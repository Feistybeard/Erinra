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
import { Segment } from "ionic-angular/components/segment/segment";
import { Slide } from "ionic-angular/components/slides/slide";

@IonicPage()
@Component({
  selector: "page-watchlist",
  templateUrl: "watchlist.html",
})
export class WatchlistPage {
  @ViewChild(Content) content: Content;
  @ViewChild("mySlider") slider: Slides;
  selectedSegment: string = "tv";
  slides: any;

  items: any;
  itemsTV: any;

  currentSegment: number;
  firstSpeed: number;
  firstCheck: boolean = false;
  currentIndex: number;
  currentSlider: any;

  placeholder: any = "../../assets/imgs/250.png";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storageProvider: StorageProvider
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

  ionViewWillEnter() {
    this.selectedSegment = this.storageProvider.getModeId();

    if (this.firstCheck == false && this.selectedSegment == "movie") {
      this.firstSpeed = this.slider.speed;
      this.slider.speed = 0;
      this.firstCheck = true;
    }
  }

  ionViewDidLoad() {}

  ionViewDidEnter() {
    this.storageProvider.getData("storageList").then((res) => {
      this.items = res;
    });

    this.storageProvider.getData("storageListTV").then((res) => {
      this.itemsTV = res;
    });
  }
  ionViewWillLeave() {
    this.storageProvider.setModeId(this.selectedSegment);
  }

  openDetails(film, index, more) {
    this.navCtrl.push(DetailsPage, { film: film, index: index, more: more });
  }
  openDetailsTV(tv, index, more) {
    this.navCtrl.push(DetailsPage, { tv: tv, index: index, more: more });
  }

  removeFromList(film: any) {
    this.storageProvider.removeData(film, "storageList");
    //this.content.resize();
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }

  removeFromListTV(tv: any) {
    this.storageProvider.removeData(tv, "storageListTV");
    this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
}
