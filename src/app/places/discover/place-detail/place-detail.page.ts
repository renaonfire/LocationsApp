import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Places } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit {

  place: Places

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private placesSrv: PlacesService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('places/discover');
        return;
      }
      this.place = this.placesSrv.getPlace(paramMap.get('placeId'));
    });
  }

  onBookPlace() {
    this.navCtrl.navigateBack('/places/discover')
  }

}
