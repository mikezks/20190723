import { createAction, props } from '@ngrx/store';
import { Flight } from '@flight-workspace/flight-api';

export const flightsLoaded = createAction(
  '[FlightBooking] Flight loaded',
  props<{ flights: Flight[] }>()
);

export const flightUpdate = createAction(
  '[FlightBooking] Flight update',
  props<{ flight: Flight }>()
);

export const flightsLoad = createAction(
  '[FlightBooking] Flights load',
  props<{ from: string, to: string }>()
);
