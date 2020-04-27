import { Injectable } from "@angular/core";
import { Bookings } from './bookings.model';

@Injectable({ providedIn: 'root'})
export class BookingsService {
    private _bookings: Bookings[] = [
        {
            id: 'zzz',
            placeId: 'p1',
            placeTitle: 'New York',
            guestNumber: 2,
            userId: 'abc'
        }
    ]

    get bookings() {
        return [...this._bookings];
    }
}