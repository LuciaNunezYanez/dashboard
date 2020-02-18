import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { SharedModule } from '../shared/shared.module';

// ROUTES
import { PAGES_ROUTES } from './pages.routes';
import { AgmCoreModule } from '@agm/core'


// COMPONENTS
import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReportesComponent } from './reportes/reportes.component';


@NgModule({
    declarations: [
        PagesComponent,
        ReporteComponent,
        ReportesComponent
    ],
    exports: [
        PagesComponent,
        ReporteComponent
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        BrowserModule
        // AgmCoreModule.forRoot({
        //   apiKey: 'AIzaSyCqxLlIIJcj2ItDwwu3FwliQmE3lPh_pw0'
        // }
        //) 
    ]
})

export class PagesModule {}
