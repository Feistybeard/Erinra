import { Component, ViewChild } from "@angular/core";
import { NavController } from "ionic-angular";
import { UpcomingPage } from "../upcoming/upcoming";
import { WatchlistPage } from "../watchlist/watchlist";
import { SearchPage } from "../search/search";
import { DetailsPage } from "../details/details";
import { Tab } from "ionic-angular/components/tabs/tab";
import { Tabs } from "ionic-angular/navigation/nav-interfaces";

@Component({
  templateUrl: "tabs.html",
})
export class TabsPage {
  tab1Root = UpcomingPage;
  tab2Root = WatchlistPage;
  tab3Root = SearchPage;

  @ViewChild("myTabs") tabRef: Tabs;

  constructor() {}
}
