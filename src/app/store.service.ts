import {Injectable} from '@angular/core';
import {DATE_FORMAT, Rating, Store} from "./report/report.model";
import {Observable, of} from "rxjs";
import * as moment from "moment";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private store: Store = {};

  constructor() {
  }

  addRating(name: string, rating: Rating): Observable<boolean> {
    this.store[name] = [...this.store[name] || [], rating];
    return of(true);
  }

  getRatings(name: string, dateFrom?: Date, dateTo?: Date): Observable<Rating[]> {
    // this.store[name] = mock; //TODO: Uncomment to test mock data against date picker
    let result = [];
    if (dateFrom && dateTo) {
      result = this.store[name].filter(rating => {
        let from = moment(dateFrom).format(DATE_FORMAT);
        let to = moment(dateTo).format(DATE_FORMAT);
        return (rating.date >= from && rating.date <= to);
      })
      return of(result);
    }

    if (dateFrom || dateTo) {
      let date = moment(dateFrom || dateTo).format(DATE_FORMAT);
      result = this.store[name].filter(rating => rating.date == date);
      return of(result);
    }

    return of(this.store[name])
  }
}

const mock: Rating[] = [
  {date: '12-06-2022', time: '21:26:43', value: 6},
  {date: '12-06-2022', time: '21:43:43', value: 4},
  {date: '13-06-2022', time: '01:26:52', value: 3},
  {date: '13-06-2022', time: '12:54:43', value: 5},
  {date: '13-06-2022', time: '14:26:43', value: 7},
  {date: '14-06-2022', time: '06:34:43', value: 9},
  {date: '15-06-2022', time: '10:26:43', value: 5},
  {date: '15-06-2022', time: '12:51:43', value: 4},
  {date: '15-06-2022', time: '20:36:43', value: 10},
  {date: '16-06-2022', time: '15:12:43', value: 8}
]
