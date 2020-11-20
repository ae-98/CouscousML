import { Component } from '@angular/core';
import { from } from 'rxjs';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx'
import * as tmImage from '@teachablemachine/image';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  label = "Vous n'avez pas encore choisi l'image";
  image = "../assets/unnamed.png";
  imageHTML;
  labelImage="";
  model;
  constructor(private camera : Camera,public toastController: ToastController) {
    
  }

  async ngOnInit(){
    const URL = "../assets/";
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";
    this.model = await tmImage.load(modelURL, metadataURL);
    this.presentToast();
  }

  async openLibrary() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetWidth: 1000,
      targetHeight: 1000,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    return await this.camera.getPicture(options);
  }
  async openPhoto(){
    const choosenPic = await this.openLibrary();
    this.image = 'data:image/jpg;base64,' + choosenPic;
    this.imageHTML = document.getElementById('pic');
    console.log(this.imageHTML);
  }

  async firstTry(){
    let maxPredictions;
    maxPredictions = this.model.getTotalClasses();
    const prediction = await this.model.predict(this.imageHTML);
    const classPrediction = prediction[0].className + ": " + prediction[0].probability.toFixed(2);
    
    if(prediction[0].probability*100>50){
      this.labelImage="../assets/yes.png";
      this.label = "Yeah! Couscous Frére";
    }else{
      this.labelImage="../assets/no.png";
      this.label = "NO NO NO, ce n'est pas de Couscous..";
    } 
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Application created by ERRKHIS.',
      duration: 2000
    });
    toast.present();
  }
}
