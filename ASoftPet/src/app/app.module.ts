//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { NgFlashMessagesModule } from 'ng-flash-messages';

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
import { RecoverPassComponent } from './components/recover-pass/recover-pass.component';
import { AddProductComponent } from './components/admin/add-product/add-product.component';
import { ProductListComponent } from './components/admin/product-list/product-list.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { FaqsComponent } from './components/footer-info/faqs/faqs.component';
import { DevolucionComponent } from './components/footer-info/devolucion/devolucion.component';
import { GetProductComponent } from './components/admin/get-product/get-product.component';
import { EditProductComponent } from './components/admin/edit-product/edit-product.component';
//Services
import { AuthService } from './shared/service/auth.service';
import { AuthGuard } from './shared/guard/auth.guard'
import { ValidateService } from './shared/service/validate.service';
import { ProductService } from './shared/service/product.service';




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
    EditProfileComponent,
    RecoverPassComponent,
    AddProductComponent,
    ProductListComponent,
    CatalogComponent,
    DetailProductComponent,
    FaqsComponent,
    DevolucionComponent,
    GetProductComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgFlashMessagesModule.forRoot(),
    FormsModule,
  ],
  providers: [AuthService, AuthGuard, ValidateService, ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
