import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import {APP_BASE_HREF} from '@angular/common';

import { OAuthModule } from 'angular-oauth2-oidc';

import { HttpService } from './services/http/http.service';
import { UserService } from './services/user/user.service';

import { AppComponent } from './app.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { HeaderComponent } from './components/header/header.component';
import { BookshelfComponent } from './components/bookshelf/bookshelf.component';
import { SidebarComponent} from './components/sidebar/sidebar.component';
import { LoginComponent } from './components/login/login.component';
import { SorryComponent } from './components/sorry/sorry.component';
import { environment } from "../environments/environment";
import {AppRoutes} from "./app.routing";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AboutComponent } from './components/about/about.component';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
    {
        path: '',
        component: ImageUploadComponent
    },
    {
        path: 'bookshelf',
        component: BookshelfComponent
    },
    {
        path: 'sorry',
        component: SorryComponent
    }
];


@NgModule({
    declarations: [
        AppComponent,
        ImageUploadComponent,
        HeaderComponent,
        BookshelfComponent,
        SidebarComponent,
        LoginComponent,
        SorryComponent,
        AboutComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        AppRoutes,
        OAuthModule.forRoot({
            resourceServer: {
                allowedUrls: [environment.apiUrl],
                sendAccessToken: true,
            },
        }),
        NgbModule.forRoot()
    ],
    providers: [
        HttpService,
        UserService,
        {provide: APP_BASE_HREF, useValue : '/' }
    ],
    bootstrap: [AppComponent],
    entryComponents: [LoginComponent]
})
export class AppModule { }
