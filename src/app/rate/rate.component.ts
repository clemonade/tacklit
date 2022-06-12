import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil, tap} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {StoreService} from "../store.service";
import {REPORT_PATH} from "../app-routing.module";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DATE_FORMAT, Rating, TIME_FORMAT} from "../report/report.model";
import * as moment from "moment";

@Component({
  selector: 'app-form',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss']
})
export class RateComponent implements OnInit, OnDestroy {

  readonly min = 1;
  readonly max = 11;
  readonly step = 1;
  readonly tickInterval = 1;
  readonly value = 6;

  readonly ratingTexts: string[] = [
    'Awesome',
    'Good',
    'OK',
    'Not great',
    'Terrible',
  ]

  name: string = '';

  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
    private matSnackBar: MatSnackBar,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        takeUntil(this.unsubscribe),
        tap(data => this.name = data['name']))
      .subscribe();
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(value: number): void {
    let date = new Date();
    let rating: Rating = {
      date: moment(date).format(DATE_FORMAT),
      time: moment(date).format(TIME_FORMAT),
      value: value
    }
    this.storeService.addRating(this.name, rating)
      .pipe(
        takeUntil(this.unsubscribe),
        tap(response => response
          ? this.matSnackBar.open('Rating submitted!', 'OK')
          : this.matSnackBar.open('Rating submission failed.', 'OK')))
      .subscribe()
  }

  onGenerateReport(): void {
    this.router.navigate([REPORT_PATH]);
  }
}
