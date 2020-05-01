import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookingsService } from './bookings.service';
import { Bookings } from './bookings.model';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {

  loadedBookings: Bookings[];
  loadedBookingsSub: Subscription;
  isLoading = false;

  constructor(private bookingsSrv: BookingsService, private loadingCtrl: LoadingController) { }

  onCancelBooking(bookingId: string, slidingEl: IonItemSliding) {
    slidingEl.close();
    this.loadingCtrl.create({
      message: 'Cancelling booking...'
    }).then(loadingEl => {
      loadingEl.present();
      this.bookingsSrv.cancelBooking(bookingId).subscribe(() => {
        loadingEl.dismiss();
      });
    });
  }

  ngOnInit() {
    this.loadedBookingsSub = this.bookingsSrv.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.bookingsSrv.fetchBookings().subscribe(() => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    if (this.loadedBookingsSub) {
      this.loadedBookingsSub.unsubscribe();
    }
  }

}
