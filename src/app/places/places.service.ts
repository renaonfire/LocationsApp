import { Injectable } from '@angular/core';
import { Places } from './places.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  img: string;
  price: number;
  title: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places = new BehaviorSubject<Places[]>([]) 

  get places() {
    return this._places.asObservable();
  }

  constructor(private authSrv: AuthService, private http: HttpClient) { }

  fetchPlaces() {
    return this.http.get<{[key: string]: PlaceData}>('https://locationsapp-73201.firebaseio.com/offered-places.json')
    .pipe(map(resData => {
      const places = [];
      for (const key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(new Places(
            key, 
            resData[key].title, 
            resData[key].description, 
            resData[key].img, 
            resData[key].price, 
            new Date(resData[key].availableFrom), 
            new Date(resData[key].availableTo), 
            resData[key].userId))
        }
      }
      return places;
    }),
    tap(places => {
      this._places.next(places);
    })
    );
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return {...places.find(p => p.id === id)}
    }))
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    let generatedId: string;
    const newPlace = new Places(
      Math.random().toString(), 
      title, 
      description, 
      'img', 
      price, 
      dateFrom, 
      dateTo, 
      this.authSrv.userId
      );
      return this.http.post<{name: string}>('https://locationsapp-73201.firebaseio.com/offered-places.json', {...newPlace, id: null})
      .pipe(
        switchMap(resData => {
          generatedId = resData.name;
          return this.places
        }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace))
        })
      )
      // return this.places.pipe(take(1), delay(1000), tap(places => {
      //   this._places.next(places.concat(newPlace));
      // }));
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Places[];
    return this.places.pipe(take(1), switchMap(places => {
      const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
      updatedPlaces = [...places];
      const oldPlace = updatedPlaces[updatedPlaceIndex];
      updatedPlaces[updatedPlaceIndex] = new Places(oldPlace.id, 
          title, 
          description, 
          oldPlace.img, 
          oldPlace.price, 
          oldPlace.availableFrom, 
          oldPlace.availableTo, 
          oldPlace.userId
          );
          return this.http.put(`https://locationsapp-73201.firebaseio.com/offered-places/${placeId}.json`, 
          { ...updatedPlaces[updatedPlaceIndex], id: null }
          );
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
