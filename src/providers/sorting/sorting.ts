import { HttpClient } from "@angular/common/http";
import { Injectable, Pipe } from "@angular/core";

@Pipe({ name: "order-by" })
export class SortingProvider {}
