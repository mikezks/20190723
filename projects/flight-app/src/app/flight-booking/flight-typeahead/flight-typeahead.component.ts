import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, interval, combineLatest, iif, of } from 'rxjs';
import { switchMap, debounceTime, filter, tap, startWith, map, distinctUntilChanged } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Flight } from '@flight-workspace/flight-api';

@Component({
  selector: 'app-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit {

  control = new FormControl();
  loading: boolean;
  flights$: Observable<Flight[]>;
  online$: Observable<boolean>;
  online: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.online$ =
      interval(2000)
        .pipe(
          startWith(0),
          map(x => Math.random() < 0.5),
          distinctUntilChanged(),
          tap(x => this.online = x)
        );

    this.flights$ = 
      this.control.valueChanges
        .pipe(
          from => combineLatest(from, this.online$),
          filter(([from, online]) => online),
          map(([from, online]) => from),
          //filter(from => from.length > 2),
          distinctUntilChanged(),
          debounceTime(300),
          switchMap(from =>
            iif(
              () => from.length > 2,
              of(from)
                .pipe(
                  tap(() => this.loading = true),
                  switchMap(from => this.load(from)),
                  tap(() => this.loading = false)
                ),
              of([])
            )
          ),

          
        )
  }

  load(from: string): Observable<Flight[]> {
    const url = 'http://www.angular.at/api/flight';

    const headers = new HttpHeaders()
      .set('Accept', 'application/json');

    const params = new HttpParams()
      .set('from', from);

    return this.http
      .get<Flight[]>(url, { headers, params });
  }

}
