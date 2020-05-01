import { Component, OnInit, OnDestroy } from '@angular/core';
import { Places } from '../places.model';
import { PlacesService } from '../places.service';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {

  offers: Places[]
  isLoading = false;
  private placesSub: Subscription;

  constructor(private placesSrv: PlacesService, private router: Router, private loadingCtrl: LoadingController) { }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    this.router.navigateByUrl('/places/tabs/offers/edit/' + offerId);
    slidingItem.close();
  }

  ngOnInit() {
    this.placesSub = this.placesSrv.places.subscribe(places => {
      this.offers = places;
    })
  }

  ionViewWillEnter() {
    this.isLoading = true;
      this.placesSrv.fetchPlaces().subscribe(() => {
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }

}
