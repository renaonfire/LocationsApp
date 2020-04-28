import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular'
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;

  constructor(private authSrv: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  onLogin() {
    this.loadingCtrl.create({keyboardClose: true, message: 'Logging in...'})
    .then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, 1500);
    })
    this.authSrv.login();
  }

  onSubmit(form: NgForm) {
    if(!form.valid) {
      return
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);
    

    if (this.isLogin) {

    } else {

    }
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin;
  }

  ngOnInit() {
  }

}
