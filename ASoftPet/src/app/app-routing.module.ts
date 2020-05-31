import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/guard/auth.guard'
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
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


const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'profile-info', component: ProfileInfoComponent, canActivate:[AuthGuard] },
  { path: 'edit-profile', component: EditProfileComponent, canActivate:[AuthGuard] },
  { path: 'recover-pass', component: RecoverPassComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'product-list', component: ProductListComponent },
  { path: 'catalog', component: CatalogComponent},
  { path: 'detail-product', component: DetailProductComponent},
  { path: 'faqs', component: FaqsComponent},
  { path: 'devolucion', component: DevolucionComponent},
  { path: 'edit-product', component: EditProductComponent},
  { path: 'get-product', component: GetProductComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [CatalogComponent]
