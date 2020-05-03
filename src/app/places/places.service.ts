import { Injectable } from '@angular/core';
import { Places } from './places.model';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  img: string;
  price: number;
  title: string;
  userId: string;
  location: any;
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
            resData[key].userId,
            resData[key].location
            ))
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
    return this.http.get<PlaceData>(`https://locationsapp-73201.firebaseio.com/offered-places/${id}.json`)
    .pipe(
      map(resData => {
        return new Places(
          id, 
          resData.title, 
          resData.description, 
          resData.img, 
          resData.price, 
          new Date(resData.availableFrom), 
          new Date(resData.availableTo),
          resData.userId,
          resData.location
          );
    }))
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, img: string, location: PlaceLocation) {
    let generatedId: string;
    const newPlace = new Places(
      Math.random().toString(), 
      title, 
      description, 
      img, 
      price, 
      dateFrom, 
      dateTo, 
      this.authSrv.userId,
      location
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

  updatePlace(placeId: string, title: string, description: string, img: string) {
    let updatedPlaces: Places[];
    return this.places.pipe(
      take(1), 
      switchMap(places => {
        if (!places || places.length <= 0 ) {
          return this.fetchPlaces();
        } else {
          // of returns an observable 
          return of(places);
        }
      }),
        switchMap(places => {
          const updatedPlaceIndex = places.findIndex(pl => pl.id === placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Places(oldPlace.id, 
            title, 
            description, 
            img, 
            oldPlace.price, 
            oldPlace.availableFrom, 
            oldPlace.availableTo, 
            oldPlace.userId,
            oldPlace.location
            );
            return this.http.put(`https://locationsapp-73201.firebaseio.com/offered-places/${placeId}.json`, 
            { ...updatedPlaces[updatedPlaceIndex], id: null }
            );
    }), tap(() => {
      this._places.next(updatedPlaces);
    }));
  }
}
