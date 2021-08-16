import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { OmdbDataProvider } from "../../providers/omdb-data/omdb-data";

/*
  Generated class for the StorageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class StorageProvider {
  items = [];
  itemsTV = [];

  modeID = "tv";
  constructor(
    public http: HttpClient,
    public storage: Storage,
    public omdbService: OmdbDataProvider
  ) {
    this.storage.get("storageList").then((json) => {
      if (json) {
        this.items = json;
      }
    });

    this.storage.get("storageListTV").then((json) => {
      if (json) {
        this.itemsTV = json;
      }
    });
  }

  getModeId() {
    return this.modeID;
  }

  setModeId(modeID) {
    this.modeID = modeID;
  }

  saveData(data: any, list: string) {
    if (list == "storageList") {
      this.items.push(data);
      if (this.items) {
        this.items.sort(function (a, b) {
          if (a.release_date > b.release_date) return 1;
          else return -1;
        });
      }
      this.storage.set(list, this.items);
    } else if (list == "storageListTV") {
      this.itemsTV.push(data);
      if (this.itemsTV) {
        this.itemsTV.sort(function (a, b) {
          if (a.first_air_date > b.first_air_date) return 1;
          else return -1;
        });
      }
      this.storage.set(list, this.itemsTV);
    }
  }

  getData(list: string) {
    return new Promise((resolve) => {
      this.storage.get(list).then((json) => {
        resolve(json);
      });
    });
  }

  removeData(data: any, list: string) {
    if (list == "storageList") {
      if (this.items) {
        if (data != -1) {
          this.items.splice(data, 1);
        }
      }
      this.storage.set(list, this.items);
    } else if (list == "storageListTV") {
      if (data != -1) {
        this.itemsTV.splice(data, 1);
      }
      this.storage.set(list, this.itemsTV);
    }
  }
}
