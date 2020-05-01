import { Injectable } from "@angular/core";
import { Bookings } from './bookings.model';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { take, delay, tap, switchMap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface BookingData {
    bookingId: string,
    dateFrom: string,
    dateTo: string,
    firstName: string,
    guestNumber: number
    lastName: string,
    placeId: string,
    placeTitle: string,
    userId: string
}

@Injectable({ providedIn: 'root'})

export class BookingsService {
    private _bookings = new BehaviorSubject<Bookings[]>([]);

    get bookings() {
        return this._bookings.asObservable();
    }

    constructor(
        private authSrv: AuthService,
        private http: HttpClient) {}
    

    fetchBookings() {
        return this.http.get<{[key: string]: BookingData}>('https://locationsapp-73201.firebaseio.com/bookings.json')
        .pipe(map(resData => {
        const bookings = [];
        for (const key in resData) {
            if (resData.hasOwnProperty(key)) {
            bookings.push(new Bookings(
                key, 
                resData[key].placeId,
                resData[key].userId,
                resData[key].placeTitle,
                resData[key].guestNumber,
                resData[key].firstName,
                resData[key].lastName,
                new Date(resData[key].dateFrom), 
                new Date(resData[key].dateTo)
            ))         
            }
        }
        return bookings;
        }),
        tap(bookings => {
        this._bookings.next(bookings);
        })
        );
    }

    addBooking(placeId: string, placeTitle: string, guestNumber: number, firstName: string, lastName: string, dateFrom: Date, dateTo: Date) {
        let generatedId: string
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
        return this.http.post<{name: string}>('https://locationsapp-73201.firebaseio.com/bookings.json', {...newBooking, id: null})
        .pipe(
            switchMap(resData => {
                generatedId = resData.name;
                return this.bookings
            }),
            take(1),
            tap(bookings => {
                newBooking.bookingId = generatedId;
                this._bookings.next(bookings.concat(newBooking))
            })
        )
    }

    cancelBooking(bookingId: string) {
        return this.bookings.pipe(take(1),
        delay(1000),
        tap(bookings => {
            this._bookings.next(bookings.filter(b => b.bookingId !== bookingId))
        }))
    }
}