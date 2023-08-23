import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root'
})
export class TrackerApiService {

  constructor() { }

  getPackageById(id: String) {
    return axios.get(`http://localhost:5000/api/packages/${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  getDeliveryById(id: String) {
    return axios.get(`http://localhost:5000/api/deliveries/${id}`,{
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
