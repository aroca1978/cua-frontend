import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { TextMaskModule } from 'angular2-text-mask';


// Apollo

import {HttpClientModule} from '@angular/common/http';
import {ApolloModule} from 'apollo-angular';
import {HttpLinkModule} from 'apollo-angular-link-http';

// Maps

import { AgmCoreModule } from '@agm/core';


// temporal
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



// Routes
import { APP_ROUTES } from './app.routes';

// Servicios
import { ServiceModule } from './services/service.module';



// Componentes
import { AppComponent } from './app.component';
import { PagenotfoundComponent } from './shared/pagenotfound/pagenotfound.component';
import { ApplyComponent } from './apply/apply.component';

import { LeadComponent } from './pages/lead/lead.component';
import { HeaderComponent } from './shared/header/header.component';
import { BreadcrumbsComponent } from './shared/breadcrumbs/breadcrumbs.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MenubarComponent } from './shared/header/menubar/menubar.component';
import { FeaturesComponent } from './pages/features/features.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { PagesComponent } from './pages/pages.component';
import { PersonalinfoComponent } from './apply/personalinfo/personalinfo.component';
import { BusinessinfoComponent } from './apply/businessinfo/businessinfo.component';
import { SalesComponent } from './apply/sales/sales.component';
import { CardprocessingComponent } from './apply/cardprocessing/cardprocessing.component';
import { ApolloService } from './services/shared/apollo.service';
import { CustomNgbDateParserFormatter } from './shared/custom-ngbDateParserFormatter';
import { ProgressbarComponent } from './shared/progressbar/progressbar.component';
import { ProgressComponent } from './apply/progress/progress.component';
import { NavbarComponent } from './apply/navbar/navbar.component';
import { AddressSelectorComponent } from './components/address-selector/address-selector.component';
import { LoaderComponent } from './apply/loader/loader.component';

@NgModule({
  declarations: [
    AppComponent,
    PagenotfoundComponent,
    ApplyComponent,
    LeadComponent,
    HeaderComponent,
    BreadcrumbsComponent,
    FooterComponent,
    MenubarComponent,
    FeaturesComponent,
    PricingComponent,
    PartnerComponent,
    ClientsComponent,
    PagesComponent,
    PersonalinfoComponent,
    BusinessinfoComponent,
    SalesComponent,
    CardprocessingComponent,
    ProgressbarComponent,
    ProgressComponent,
    NavbarComponent,
    AddressSelectorComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    APP_ROUTES,
    FormsModule,
    ReactiveFormsModule,
    ServiceModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    NgbModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: '',
      libraries: ['places']
    }),
    TextMaskModule,
  ],

  providers: [{provide: NgbDateParserFormatter, useFactory: () => new CustomNgbDateParserFormatter()},
    ApolloService],
  bootstrap: [AppComponent],
  entryComponents: [AddressSelectorComponent],
  exports: [ AddressSelectorComponent ]
})
export class AppModule { }
