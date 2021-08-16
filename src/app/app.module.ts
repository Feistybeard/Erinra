import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicModule, IonicErrorHandler } from "ionic-angular";
import { MyApp } from "./app.component";

import { UpcomingPage } from "../pages/upcoming/upcoming";
import { WatchlistPage } from "../pages/watchlist/watchlist";
import { SearchPage } from "../pages/search/search";
import { TabsPage } from "../pages/tabs/tabs";
import { DetailsPage } from "../pages/details/details";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";

import { HttpClientModule } from "@angular/common/http";
import { HttpModule } from "@angular/http";
import { OmdbDataProvider } from "../providers/omdb-data/omdb-data";
import { IonicStorageModule } from "@ionic/storage";
import { StorageProvider } from "../providers/storage/storage";
import { SortingProvider } from "../providers/sorting/sorting";

@NgModule({
  declarations: [
    MyApp,
    UpcomingPage,
    WatchlistPage,
    SearchPage,
    DetailsPage,
    TabsPage,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    UpcomingPage,
    WatchlistPage,
    SearchPage,
    DetailsPage,
    TabsPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    OmdbDataProvider,
    StorageProvider,
    SortingProvider,
  ],
})
export class AppModule {}
