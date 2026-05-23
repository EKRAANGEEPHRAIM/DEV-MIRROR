import { Profil } from './shared/components/profil/profil';
import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth-guard";

export const routes : Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },

    {
        path:'auth',
        children: [
            {
                path:'login',
                loadComponent:() => import('./shared/components/login/login').then(m => m.Login)
            },

            {
                path: 'register',
                loadComponent:() => import('./shared/components/register/register').then(m => m.Register)
            }
        ]
    },

    {
        path:'dashboard',
        canActivate:[authGuard],
        loadComponent:() => import('./shared/components/dashboard/dashboard').then(m => m.Dashboard)
    },

    {
  path: 'profile/:username',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./shared/components/profil/profil').then(
      (m) => m.Profil,
    ),
},

    {
        path:'**',
        redirectTo:'dashboard'
    }
]