import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { switchMap, map } from 'rxjs/operators';

import * as FlightBookingActions from '../actions/flight-booking.actions';
import { FlightService } from '@flight-workspace/flight-api';


@Injectable()
export class FlightBookingEffects {

  loadFlights = createEffect(() => 
    this.actions$
      .pipe(
        ofType(FlightBookingActions.flightsLoad),
        switchMap(action => this.flightService.find(action.from, action.to)),
        map(flights => FlightBookingActions.flightsLoaded({ flights: flights }))
      )
    );

  constructor(
    private actions$: Actions,
    private flightService: FlightService) {}

}
