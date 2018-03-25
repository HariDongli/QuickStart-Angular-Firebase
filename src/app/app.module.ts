import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatCardModule} from '@angular/material/card';

import { AppComponent } from './app.component';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database'
import { environment } from "../environments/environment";
import { BidcreatorComponent } from './bidcreator/bidcreator.component';
import { UserComponent } from './user/user.component';
import {RouterModule,Route} from '@angular/router';
import { MomentModule } from 'angular2-moment';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule } from '@angular/material/button';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CountdownModule } from 'ngx-countdown';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatTableModule} from '@angular/material/table';

const routes: Route[] =[
  { path: '' , redirectTo: 'creator' ,pathMatch:'full'},
  {path: 'creator' ,component: BidcreatorComponent},
  {path: 'users/:id', component: UserComponent}

]
@NgModule({
  declarations: [
    AppComponent,
    BidcreatorComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    CountdownModule,
    MatTableModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    MomentModule,
    RouterModule.forRoot( routes),
    MatIconModule,
    MatTabsModule,
    BrowserAnimationsModule,
    MatCardModule,
    NoopAnimationsModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatExpansionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
