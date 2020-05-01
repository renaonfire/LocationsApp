import { Component, OnInit, OnDestroy } from '@angular/core';
import { Places } from '../../places.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {

  place: Places;
  form: FormGroup;
  isLoading = false;
  placeId: string;
  private placeSub: Subscription;

  constructor( 
    private route: ActivatedRoute, 
    private placesSrv: PlacesService, 
    private navCtrl: NavController, 
    private router: Router, 
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
    ) { }

  onUpdateOffer() {
    if(!this.form.valid) {
      return;
    }
    this.loadingCtrl.create({
      message: 'Updating Place...'
    }).then(loadingEl => {
      loadingEl.present();
      this.placesSrv.updatePlace(
        this.place.id, 
        this.form.value.title, 
        this.form.value.description, 
        this.form.value.img
        ).subscribe(() => {
          loadingEl.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tabs/offers')
        });
    }) 
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/tabs/offers');
        return;
      }
      this.placeId = paramMap.get('placeId');
      this.isLoading = true;
      this.placeSub = this.placesSrv.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.maxLength(40)]
          }), 
          description: new FormControl(this.place.description, {
            updateOn: 'blur'
          }), 
          price: new FormControl(this.place.price, {
            updateOn: 'blur'
          }),
          dateFrom: new FormControl(this.place.availableFrom.toISOString(), {
            updateOn: 'blur'
          }),
          dateTo: new FormControl(this.place.availableTo.toISOString(), {
            updateOn: 'blur'
          }),
          img: new FormControl(this.place.img, {
            updateOn: 'blur'
          })
        });
        this.isLoading = false;
      }, error => {
        this.alertCtrl.create({
          header: 'Whoops, something went wrong',
          message: 'The page does not exist',
          buttons: [{text: 'Okay', handler: () => {
            this.router.navigateByUrl('/places/tabs/offers');
          }}]
        }).then(alertEl => {
          alertEl.present();
        })
      });
    });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
