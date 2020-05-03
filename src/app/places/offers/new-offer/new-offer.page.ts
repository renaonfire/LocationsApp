import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PlacesService } from '../../places.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { PlaceLocation } from '../../location.model';

@Component({
  selector: 'app-new-offer',
  templateUrl: './new-offer.page.html',
  styleUrls: ['./new-offer.page.scss'],
})
export class NewOfferPage implements OnInit {

  form: FormGroup;

  constructor(private placesSrv: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }), 
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1)]
      }), 
      dateFrom: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      dateTo: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required]
      }),
      img: new FormControl(null, {
        updateOn: 'blur'
      }),
      location: new FormControl(null, {
        validators: [Validators.required]
      })
    });
  }

  onCreateOffer() {
    if (!this.form.valid) {
      console.log(this.form);
    }
    this.loadingCtrl.create({
      message: 'Creating place...'
    }).then(loadingEL => {
      loadingEL.present();
      this.placesSrv.addPlace(
        this.form.value.title, 
        this.form.value.description,
        +this.form.value.price,
        new Date(this.form.value.dateFrom),
        new Date(this.form.value.dateTo),
        this.form.value.img,
        this.form.value.location
        ).subscribe(() => {
          loadingEL.dismiss();
          this.form.reset();
          this.router.navigateByUrl('/places/tabs/offers')
        });
    })
  }

  onLocationPicked(locationReceived: PlaceLocation) {
    this.form.patchValue({location: locationReceived})
  }

}
