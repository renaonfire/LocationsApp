import { Component, OnInit, Input } from '@angular/core';
import { Places } from 'src/app/places/places.model';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss'],
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Places;

  constructor(private modalCtrl: ModalController) { }

  onBookPlace() {
    this.modalCtrl.dismiss({message: 'this is a message'}, 'confirm')
  }

  onCancel() {
    this.modalCtrl.dismiss(); 
  }

  ngOnInit() {}

}
