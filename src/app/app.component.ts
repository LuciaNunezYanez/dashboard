import { Component } from '@angular/core';
import { SwPush }  from  '@angular/service-worker';
// const webpush = require('web-push');


// const publicVapidKey = 'BOa5kTrF7tS_ix4l2Mglhq1XQJK-mg4u7xfxKoFimw4dCYeOV8kMybuzD0W1aHjQr2QJcfLyJBs9XZEHKpN-zk8';
// const privateVapidKey = '8v4uEeAoGYkLiesBKsK0-4D_CAucay50hs4xG5Baeqs';
// const VAPID_PUBLIC = 'BOa5kTrF7tS_ix4l2Mglhq1XQJK-mg4u7xfxKoFimw4dCYeOV8kMybuzD0W1aHjQr2QJcfLyJBs9XZEHKpN-zk8';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'nitdurango';

  constructor(){
    // _swPush: SwPush
    // webpush.setGCMAPIKey('<Your GCM API Key Here>');
    // webpush.setVapidDetails(
    //   'mailto:example@yourdomain.org',
    //   publicVapidKey, 
    //   privateVapidKey
    // );
  }
}
