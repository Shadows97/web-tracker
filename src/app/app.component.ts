import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TrackerApiService } from './services/tracker-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  center!: google.maps.LatLngLiteral;

  deliveryData: any;
  packageData: any;
  fromMarker: any;
  toMarker: any;
  errorMsg: String = '';

  searchForm!: FormGroup;

  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 15,
    minZoom: 8,
  };

  constructor(private formBuilder: FormBuilder,private tracket_api: TrackerApiService){

  }
 
  ngOnInit() {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     this.center = {
  //       lat: position.coords.latitude,
  //       lng: position.coords.longitude,
  //     };
  //   });
  this.searchForm = this.formBuilder.group({
    search: ['', Validators.required],
  });
  }

  getObjectProperties(obj: any): { label: string; value: any }[] {
    const properties = [];
  
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        properties.push({ label: key.replace(/_/g, ' '), value: obj[key] });
      }
    }
  
    return properties;
  }

  onSubmitSearch() {
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;
      this.tracket_api.getPackageById(formData.search)
      .then((resp) => {
        console.log(resp.data)
        this.packageData = resp.data
        this.fromMarker = {
          position: this.packageData.from_location,
          label: "From Location",
          title: "From Location",
          options: { animation: google.maps.Animation.BOUNCE }
        };
        this.toMarker = {
          position: this.packageData.to_location,
          label: "To Location",
          title: "To Location",
          options: { animation: google.maps.Animation.BOUNCE }
        }
        this.errorMsg = ''
        console.log(this.packageData.active_delivery_id)
        if (this.packageData.active_delivery_id){
          this.tracket_api.getDeliveryById(this.packageData.active_delivery_id)
          .then((resp) => {
            console.log(resp.data)
            this.deliveryData = resp.data
            this.errorMsg = ''
            this.center = this.deliveryData.location;
            
          })
          .catch((error) => {
            const msg: any = error.response.data.error;
       
            console.log(msg);
            this.errorMsg = msg;
          })
        }
      })
      .catch((error) => {
        const msg: any = error.response.data.error;
       
            console.log(msg.message);
            this.errorMsg = msg;
      })
    }

  }
  
}
