import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {DefaultLayout} from "./default.layout";
import {RouterModule} from "@angular/router";

@NgModule({
    declarations: [
        DefaultLayout
    ],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class LayoutsModule {
}
