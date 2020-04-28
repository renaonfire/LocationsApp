import { Component, OnInit } from '@angular/core';
import { Places } from '../../places.model';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../../places.service';
import { NavController } from '@ionic/angular';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit {

  place: Places;
  form: FormGroup;

  constructor( private route: ActivatedRoute, private placesSrv: PlacesService, private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/offers');
        return;
      }
      this.place = this.placesSrv.getPlace(paramMap.get('placeId'));
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
  }


  onUpdateOffer() {
    if(!this.form.valid) {
      return;
    }
    console.log(this.form);
    
  }


}
