import { Component, OnInit } from '@angular/core';
import { Places } from '../../places.model';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-bookings',
  templateUrl: './place-bookings.page.html',
  styleUrls: ['./place-bookings.page.scss'],
})
export class PlaceBookingsPage implements OnInit {
  place: Places;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesSrv: PlacesService, private router: Router) { }

  onEdit() {
    this.router.navigateByUrl('/places/offers/edit/' + this.place.id);
  }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/offers');
        return;
      }
      this.place = this.placesSrv.getPlace(paramMap.get('placeId'));
    });
  }

}
