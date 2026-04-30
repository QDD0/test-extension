import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './auth/components/home/home.component';
import { TestStartComponent } from './auth/test-start/test-start.component';
import {ResultComponent} from './auth/result/result.component';
import {AdminPanelComponent} from './auth/admin/admin.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tests-page', component: HomeComponent },
  { path: 'test-start/:id', component: TestStartComponent },
  { path: 'result/:id', component: ResultComponent },
  {path: 'admin', component: AdminPanelComponent},
  { path: '**', redirectTo: '/login' }
];
