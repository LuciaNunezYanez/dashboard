import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { FormsModule }   from '@angular/forms';


// MODULOS
import { PagesModule } from './pages/pages.module';
import { HttpClientModule } from '@angular/common/http';

// ROUTES
import { AppRoutingModule } from './app-routing.module';

// COMPONENTS
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register.component';


const config: SocketIoConfig = {
  url: environment.wsUrl,
  options: {}
};


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    AppRoutingModule,
    FormsModule,
    SocketIoModule.forRoot(config),
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
