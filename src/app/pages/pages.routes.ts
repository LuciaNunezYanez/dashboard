import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte.component';
import { AuthGuard } from '../guards/auth.guard';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'reporte/:id_reporte', component: ReporteComponent, canActivate: [ AuthGuard]},
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
