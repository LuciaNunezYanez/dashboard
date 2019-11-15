import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NopagefoundComponent } from './nopagefound/nopagefound.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
    declarations: [
        NopagefoundComponent,
        SidebarComponent
    ],
    exports: [
        NopagefoundComponent,
        SidebarComponent
    ],
    imports: [
        CommonModule
    ]
})

export class SharedModule { }
