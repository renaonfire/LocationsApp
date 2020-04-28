import { Component, OnInit, Input } from '@angular/core';
import { Places } from '../../places.model';

@Component({
  selector: 'app-offer-item',
  templateUrl: './offer-item.component.html',
  styleUrls: ['./offer-item.component.scss'],
})
export class OfferItemComponent implements OnInit {

  @Input() offer: Places;

  constructor() { }

  getDummyDate() {
    return new Date();
  }

  ngOnInit() {}

}
