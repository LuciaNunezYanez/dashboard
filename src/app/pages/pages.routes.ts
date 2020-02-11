import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte.component';
import { AuthGuard } from '../guards/auth.guard';
import { ReportesComponent } from './reportes/reportes.component';

const pagesRoutes: Routes = [
  {
    path: '', component: PagesComponent, canActivate: [ AuthGuard ],
    children: [
      { path: 'reporte/:id_reporte', component: ReporteComponent, canActivate: [ AuthGuard ]},
      { path: 'reportes', component: ReportesComponent, canActivate: [ AuthGuard ]},
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
