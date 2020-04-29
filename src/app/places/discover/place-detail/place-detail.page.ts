import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Places } from '../../places.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Places
  isBookable = false;
  private placeSub: Subscription;

  constructor(private route: ActivatedRoute, 
    private navCtrl: NavController, 
    private placesSrv: PlacesService, 
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingSrv: BookingsService,
    private loadingCtrl: LoadingController,
    private authSrv: AuthService
    ) { }
    
    onBookPlace() {
      this.actionSheetCtrl.create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select Date',
            handler: () => {
              this.openBookingModal('select');
            }
          }, 
          {
            text: 'Random Date',
            handler: () => {
              this.openBookingModal('random');
            }
          },
          {
            text: 'Cancel',
            role: 'destructive'
          }
        ]
      }).then(actionSheetEl => {
        actionSheetEl.present();
      })
    }
  
    openBookingModal(mode: 'select' | 'random') {
      this.modalCtrl.create({
        component: CreateBookingComponent,
        componentProps: {selectedPlace: this.place, selectedMode: mode}
      }).then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(resultData => {
        this.loadingCtrl.create({
          message: 'Booking Place...'
        }).then(loadingEl => {
          loadingEl.present();
          let bookingData = resultData.data.bookingData;
          this.bookingSrv.addBooking(
            this.place.id, 
            this.place.title, 
            bookingData.guestNumber, 
            bookingData.firstName, 
            bookingData.lastName, 
            bookingData.startDate, 
            bookingData.endDate
            ).subscribe(() => {
              loadingEl.dismiss();
            })
        })
      })
    }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/discover');
        return;
      }
      this.placeSub = this.placesSrv.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.isBookable = place.userId !== this.authSrv.userId;
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }


}
