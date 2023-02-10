import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte/reporte.component';
import { ReporteTrComponent } from './reporte/reporte-tr/reporte-tr.component';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { RegistroUnidadesComponent } from './registro/registro-unidades/registro-unidades.component';
import { RegistroUsuariosComponent } from './registro/registro-usuarios/registro-usuarios.component';

// Guards
import { AuthGuard } from '../guards/auth.guard';
import { TrGuard } from '../guards/tr.guard';

const pagesRoutes: Routes = [
  {
    path: '', component: PagesComponent, canActivate: [ AuthGuard ],
    children: [
      { path: 'reporte/:id_reporte', component: ReporteComponent, canActivate: [ AuthGuard ]},
      { path: 'reportetr/:id_reporte', component: ReporteTrComponent, canActivate: [ AuthGuard, TrGuard ]},
      { path: 'busqueda', component: BusquedaComponent, canActivate: [ AuthGuard ]},
      { path: 'regunidades', component: RegistroUnidadesComponent, canActivate: [ AuthGuard ]},
      { path: 'regusuarios', component: RegistroUsuariosComponent, canActivate: [ AuthGuard ]},
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
