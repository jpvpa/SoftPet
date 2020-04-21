//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

//Components
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { ProfileSidebarComponent } from './components/profile/profile-sidebar/profile-sidebar.component';
import { ProfileInfoComponent } from './components/profile/profile-info/profile-info.component';
import { EditProfileComponent } from './components/profile/edit-profile/edit-profile.component'

//Services
import { AuthService } from './service/auth.service';

//Other



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    FooterComponent,
    NavbarComponent,
    ProfileComponent,
    ProfileSidebarComponent,
    ProfileInfoComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }
