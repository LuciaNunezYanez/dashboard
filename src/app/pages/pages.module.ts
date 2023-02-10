import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { SharedModule } from '../shared/shared.module';
import { AgmCoreModule } from '@agm/core'

// ROUTES
import { PAGES_ROUTES } from './pages.routes';


// COMPONENTS
import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte/reporte.component';
import { BrowserModule } from '@angular/platform-browser';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { environment } from 'src/environments/environment';
import { RegistroUnidadesComponent } from './registro/registro-unidades/registro-unidades.component';
import { RegistroUsuariosComponent } from './registro/registro-usuarios/registro-usuarios.component';
import { ReporteTrComponent } from './reporte/reporte-tr/reporte-tr.component';


@NgModule({
    declarations: [
        PagesComponent,
        ReporteComponent,
        BusquedaComponent,
        RegistroUnidadesComponent,
        RegistroUsuariosComponent,
        ReporteTrComponent
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
