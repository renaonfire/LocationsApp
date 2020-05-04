import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { Places } from '../../places.model';
import { PlacesService } from '../../places.service';
import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Subscription } from 'rxjs';
import { BookingsService } from 'src/app/bookings/bookings.service';
import { AuthService } from 'src/app/auth/auth.service';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {

  place: Places
  isBookable = false;
  isLoading = false;
  private placeSub: Subscription;

  constructor(private route: ActivatedRoute, 
    private navCtrl: NavController, 
    private placesSrv: PlacesService, 
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingSrv: BookingsService,
    private loadingCtrl: LoadingController,
    private authSrv: AuthService,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

    ngOnInit() {
      this.route.paramMap.subscribe(paramMap => {
        if (!paramMap.has('placeId')) {
          this.navCtrl.navigateBack('places/tabs/discover');
          return;
        }
        this.isLoading = true;
        this.placeSub = this.placesSrv
          .getPlace(paramMap.get('placeId'))
          .subscribe(
            place => {
              this.place = place;
              this.isBookable = place.userId !== this.authSrv.userId;
              this.isLoading = false;
        }, error => {
          this.alertCtrl.create({
            header: 'Whoops',
            message: 'Something went wrong',
            buttons: [{text: 'Okay', handler: () => {
              this.router.navigateByUrl('/places/tabs/discover');
            }}]
          }).then(alertEl => 
            alertEl.present());
        })
      });
    }
  
    onShowFullMap() {
      this.modalCtrl.create({
        component: MapModalComponent,
        componentProps: {
          center: {lat: this.place.location.lat, lng: this.place.location.lng},
          selectable: false,
          closeButtonText: 'Close',
          title: this.place.location.address
        }
      }).then(modalEl => modalEl.present());
    }

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

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }


}
