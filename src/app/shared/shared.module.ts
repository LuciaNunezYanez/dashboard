import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

import { RouterModule } from '@angular/router';
@NgModule({
    declarations: [
        NopagefoundComponent,
        SidebarComponent, 
        HeaderComponent
    ],
    exports: [
        NopagefoundComponent,
        SidebarComponent, 
        HeaderComponent
    ],
    imports: [
        CommonModule,
        RouterModule
    ]
})

export class SharedModule { }
