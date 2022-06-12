import {Component, OnDestroy, OnInit} from '@angular/core';
import {Color, ScaleType} from "@swimlane/ngx-charts";
import {StoreService} from "../store.service";
import {Observable, Subject, take, takeUntil, tap} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Rating} from "./report.model";
import * as math from 'mathjs';
import {curveMonotoneX} from 'd3-shape';
import {FormBuilder} from "@angular/forms";
import * as moment from "moment";

interface Result {
  name: string,
  series: { name: string, value: number }[]
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  form = this.formBuilder.group({
    dateFrom: null,
    dateTo: null
  })

  results: Result[] = [{name: "", series: []}];

  count: number = 0;
  mean: number = 0;
  max: number = 0;
  min: number = 0;
  standardDeviation: number = 0;

  scope: string = 'Overall'
  sufficientData: boolean = false;

  readonly view: [number, number] = [350, 300];
  readonly scheme: Color = {
    name: '',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: ['lightblue']
  }
  readonly xAxis: boolean = false;
  readonly yAxis: boolean = true;
  readonly showGridLines: boolean = false
  readonly showXAxisLabel: boolean = false;
  readonly showYAxisLabel: boolean = false;
  readonly xAxisLabel: string = 'Date / Time';
  readonly yAxisLabel: string = 'Happiness Rating';
  readonly yAxisTicks = [0, 3, 6, 11];
  readonly curve: any = curveMonotoneX;
  readonly yScaleMin = 0;
  readonly yScaleMax = 11;

  private name: string = '';
  private unsubscribe: Subject<void> = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storeService: StoreService
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.data
      .pipe(
        takeUntil(this.unsubscribe),
        tap(data => {
          this.name = data['name'];
          this.getRatings().subscribe();
        }))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onSubmit(): void {
    let dateFrom = this.form.get('dateFrom')?.value;
    let dateTo = this.form.get('dateTo')?.value;
    this.getRatings(dateFrom, dateTo)
      .pipe(tap(_ => this.scope = this.getScope(dateFrom, dateTo)))
      .subscribe();

  }

  private getRatings(dateFrom?: Date, dateTo?: Date): Observable<Rating[]> {
    return this.storeService.getRatings(this.name, dateFrom, dateTo)
      .pipe(
        take(1),
        tap(ratings => this.mapToResults(ratings || [])));
  }

  private mapToResults(ratings: Rating[]): void {
    if (ratings.length < 2) {
      this.sufficientData = false;
      return;
    }
    const ratingValues = ratings.map(rating => rating.value);
    this.count = ratings.length;
    this.min = Math.min(...ratingValues);
    this.max = Math.max(...ratingValues);
    this.mean = math.mean(...ratingValues);
    this.standardDeviation = math.std(...ratingValues);

    const results = ratings.map(rating => {
      return {
        name: `${rating.date} ${rating.time}`,
        value: rating.value
      }
    })
    this.results = [{name: "", series: results}];
    this.sufficientData = true;
  }

  private getScope = (dateFrom?: Date, dateTo?: Date): string => {
    let from = dateFrom ? moment(dateFrom).format('DD MMM yyyy') : ''
    let to = dateTo ? moment(dateTo).format('DD MMM yyyy') : ''
    if (from && to) {
      return from == to
        ? `${from}`
        : `${from} to ${to}`;
    }
    return from || to || 'Overall'
  };
}
