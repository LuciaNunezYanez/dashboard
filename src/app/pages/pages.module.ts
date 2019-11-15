import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'

import { SharedModule } from '../shared/shared.module';

// ROUTES
import { PAGES_ROUTES } from './pages.routes';

// COMPONENTS
import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte.component';
import { ComercioComponent } from './comercio/comercio.component';
import { MapaComponent } from './mapa/mapa.component';
import { AudioComponent } from './audio/audio.component';
import { ImagenesComponent } from './imagenes/imagenes.component';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
    declarations: [
        PagesComponent,
        ReporteComponent,
        ComercioComponent,
        MapaComponent,
        AudioComponent,
        ImagenesComponent
    ],
    exports: [
        PagesComponent,
        ReporteComponent,
        ComercioComponent
    ],
    imports: [
        SharedModule,
        PAGES_ROUTES,
        FormsModule,
        BrowserModule 
    ]
})

export class PagesModule {}
