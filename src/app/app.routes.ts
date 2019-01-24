import { RouterModule, Routes } from '@angular/router';

import { PagesComponent } from './pages/pages.component';
import { LeadComponent } from './pages/lead/lead.component';
import { ApplyComponent } from './apply/apply.component';
import { FeaturesComponent } from './pages/features/features.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
import { PersonalinfoComponent } from './apply/personalinfo/personalinfo.component';
import { BusinessinfoComponent } from './apply/businessinfo/businessinfo.component';
import { SalesComponent } from './apply/sales/sales.component';
import { CardprocessingComponent } from './apply/cardprocessing/cardprocessing.component';

const appRoutes: Routes = [
{
    path: '',
    component: PagesComponent,
    children: [
        { path: 'signup', component: LeadComponent },
        { path: 'features', component: FeaturesComponent },
        { path: 'pricing', component: PricingComponent },
        { path: 'clientes', component: ClientsComponent },
        { path: '', redirectTo: '/signup', pathMatch: 'full' }
    ]
},
{ path: 'apply', component: ApplyComponent,
    children: [
        { path: 'personalinfo', component: PersonalinfoComponent },
        { path: 'businessinfo', component: BusinessinfoComponent },
        { path: 'sales', component: SalesComponent },
        { path: 'cardprocessing', component: CardprocessingComponent },
        { path: '', redirectTo: '/apply/personalinfo', pathMatch: 'full'}
    ]
},

{ path: '**', component: PagenotfoundComponent },
];

export const APP_ROUTES = RouterModule.forRoot( appRoutes, { useHash: true } );

