import { Component, OnInit } from '@angular/core';
import { Places } from '../places.model';
import { PlacesService } from '../places.service';
import { IonItemSliding } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offers: Places[]


  constructor(private placesSrv: PlacesService, private router: Router) { }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    this.router.navigateByUrl('/places/tabs/offers/edit/' + offerId);
    slidingItem.close();
  }

  ngOnInit() {
    this.offers = this.placesSrv.places;
  }

}
