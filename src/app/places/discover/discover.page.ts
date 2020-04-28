import { Component, OnInit, OnDestroy } from '@angular/core';
import { Places } from '../places.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Places[]
  private loadedPlacesSub: Subscription;

  constructor(private placesSrv: PlacesService) { }

  onFilterUpdate(event: CustomEvent) {
    console.log(event.detail);
    
  }

  ngOnInit() {
    this.loadedPlacesSub = this.placesSrv.places.subscribe(places => {
      this.loadedPlaces = places;
    })
  }

  ngOnDestroy() {
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
  }

}
