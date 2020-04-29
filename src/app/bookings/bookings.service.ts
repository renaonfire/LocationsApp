import { Injectable } from "@angular/core";
import { Bookings } from './bookings.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root'})

export class BookingsService {
    private _bookings = new BehaviorSubject<Bookings[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    constructor(private authSrv: AuthService) {}
    

    addBooking(placeId: string, placeTitle: string, guestNumber: number, firstName: string, lastName: string, dateFrom: Date, dateTo: Date) {
        const newBooking = new Bookings(
            Math.random().toString(),
            placeId,
            this.authSrv.userId,
            placeTitle,
            guestNumber,
            firstName,
            lastName,
            dateFrom,
            dateTo
        );
        return this.bookings.pipe(take(1), delay(1000), tap(booking => {
            this._bookings.next(booking.concat(newBooking));
        }));
    }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(take(1),
        delay(1000),
        tap(bookings => {
            this._bookings.next(bookings.filter(b => b.bookingId !== bookingId))
        }))
    }
}