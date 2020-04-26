import { Component, OnInit } from '@angular/core';
import { Places } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit {

  offers: Places[]

  constructor(private placesSrv: PlacesService) { }

  ngOnInit() {
    this.offers = this.placesSrv.places;
  }

}
