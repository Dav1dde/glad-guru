import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SearchPageComponent} from "./pages/search-page/search-page.component";
import {DocumentPageComponent} from "./pages/document-page/document-page.component";

const routes: Routes = [
    {
        path: '',
        component: SearchPageComponent
    },
    {
        path: ':symbol',
        component: DocumentPageComponent,
    },
    {
        path: ':symbol/:api',
        component: DocumentPageComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
