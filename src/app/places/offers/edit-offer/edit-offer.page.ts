import { Component, OnInit, OnDestroy } from '@angular/core';
import { Places } from '../../places.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController } from '@ionic/angular';
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
  private placeSub: Subscription;

  constructor( private route: ActivatedRoute, private placesSrv: PlacesService, private navCtrl: NavController) { }

  onUpdateOffer() {
    if(!this.form.valid) {
      return;
    }
    console.log(this.form);
    
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/offers');
        return;
      }
      this.placeSub = this.placesSrv.getPlace(paramMap.get('placeId')).subscribe(place => {
        this.place = place;
        this.form = new FormGroup({
          title: new FormControl(this.place.title, {
            updateOn: 'blur',
            validators: [Validators.maxLength(40)]
          }), 
          description: new FormControl(this.place.description, {
            updateOn: 'blur'
          })
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
