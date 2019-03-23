import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchPageComponent} from './pages/search-page/search-page.component';
import {AutoCompleteSearchComponent} from './components/auto-complete-search/auto-complete-search.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import { DocumentPageComponent } from './pages/document-page/document-page.component';
import { AutoCompleteInputDirective } from './components/auto-complete-search/auto-complete-input.directive';

@NgModule({
    declarations: [
        AppComponent,
        SearchPageComponent,
        AutoCompleteSearchComponent,
        AutoCompleteInputDirective,
        DocumentPageComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
