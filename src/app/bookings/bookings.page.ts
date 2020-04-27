import { Component, OnInit } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Bookings } from './bookings.model';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  loadedBookings: Bookings[];

  constructor(private bookingsSrv: BookingsService) { }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    
  }

  ngOnInit() {
    this.loadedBookings = this.bookingsSrv.bookings;
  }

}
