import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module';
import { AgmCoreModule } from '@agm/core'

// ROUTES
import { PAGES_ROUTES } from './pages.routes';


// COMPONENTS
import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte.component';
import { BrowserModule } from '@angular/platform-browser';
import { ReportesComponent } from './reportes/reportes.component';
import { environment } from 'src/environments/environment';


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
        ReactiveFormsModule,
        BrowserModule,
        AgmCoreModule.forRoot({
          apiKey: environment.API_KEY
        }
        ) 
    ]
})

export class PagesModule {}
