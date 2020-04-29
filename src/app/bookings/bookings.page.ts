import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Bookings } from './bookings.model';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Bookings[];
  loadedBookingsSub: Subscription;

  constructor(private bookingsSrv: BookingsService) { }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    
  }

  ngOnInit() {
    this.loadedBookingsSub = this.bookingsSrv.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    })
  }

  ngOnDestroy() {
    if (this.loadedBookingsSub) {
      this.loadedBookingsSub.unsubscribe();
    }
  }

}
