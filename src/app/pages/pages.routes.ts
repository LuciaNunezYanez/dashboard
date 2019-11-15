import { Routes, RouterModule } from '@angular/router';

import { PagesComponent } from './pages.component';
import { ReporteComponent } from './reporte/reporte.component';

const pagesRoutes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: 'reporte/:id_reporte', component: ReporteComponent },
    ]
  }
];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
