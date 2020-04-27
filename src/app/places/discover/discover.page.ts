import { Component, OnInit } from '@angular/core';
import { Places } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  loadedPlaces: Places[]

  constructor(private placesSrv: PlacesService) { }

  onFilterUpdate(event: CustomEvent) {
    console.log(event.detail);
    
  }

  ngOnInit() {
    this.loadedPlaces = this.placesSrv.places;
  }

}
