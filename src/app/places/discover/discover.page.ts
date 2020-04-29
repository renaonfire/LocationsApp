import { Component, OnInit, OnDestroy } from '@angular/core';
import { Places } from '../places.model';
import { PlacesService } from '../places.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit, OnDestroy {
  loadedPlaces: Places[];
  allPlaces: Places[];
  private loadedPlacesSub: Subscription;

  constructor(private placesSrv: PlacesService, private authSrv: AuthService) { }

  onFilterUpdate(event: CustomEvent) {
    if (event.detail.value === 'all') {
      this.loadedPlaces = this.allPlaces;
    } else {
      this.loadedPlaces = this.allPlaces.filter(place => place.userId !== this.authSrv.userId);
    }
    
  }

  ngOnInit() {
    this.loadedPlacesSub = this.placesSrv.places.subscribe(places => {
      this.allPlaces = places;
      this.loadedPlaces = this.allPlaces;

    })
  }

  ngOnDestroy() {
    if (this.loadedPlacesSub) {
      this.loadedPlacesSub.unsubscribe();
    }
  }

}
