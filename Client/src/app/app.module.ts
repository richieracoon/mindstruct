import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {FormsModule} from '@angular/forms';
import {MindmapComponent} from './components/mindmap/mindmap.component';
import {LandingpageComponent} from './components/landingpage/landingpage.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {InfopageComponent} from './components/infopage/infopage.component';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from './components/main/main.component';
import {LoggedinComponent} from './components/loggedin/loggedin.component';
import {ProjectsComponent} from './components/loggedin/projects/projects.component';
import {ProfilesComponent} from './components/loggedin/profiles/profiles.component';
import {AdmindashComponent} from './components/loggedin/admindash/admindash.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {ColorPickerModule} from 'ngx-color-picker';
import {AuthService} from './services/auth.service';
import {HttpClientModule} from '@angular/common/http';
import { ProjectdetailComponent } from './components/loggedin/projects/projectdetail/projectdetail.component';
import {SocketIoModule, SocketIoConfig} from 'ngx-socket-io';

const routes: Routes = [
  {path: '', redirectTo: '/welcome', pathMatch: 'full'},
  {path: 'welcome', component: LandingpageComponent},
  {path: 'info', component: InfopageComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'mindmap', component: MindmapComponent},
  {path: 'loggedin', component: LoggedinComponent, children: [
      {path: 'admin', component: AdmindashComponent},
      {path: 'profile', component: ProfilesComponent},
      {path: 'projects', component: ProjectsComponent}
    ]},
];

const socketioconfig: SocketIoConfig = {url: 'https://localhost:8843', options: {}};
@NgModule({
  declarations: [
    AppComponent,
    MindmapComponent,
    LandingpageComponent,
    LoginComponent,
    RegisterComponent,
    InfopageComponent,
    MainComponent,
    LoggedinComponent,
    ProjectsComponent,
    ProfilesComponent,
    AdmindashComponent,
    ProjectdetailComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(socketioconfig),
    AngularFontAwesomeModule,
    ColorPickerModule,
    HttpClientModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [MainComponent]
})
export class AppModule {
}
