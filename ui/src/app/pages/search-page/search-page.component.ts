import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
    content: Observable<string>;

    constructor(private dataService: DataService) {
    }

    get symbols() {
        return this.dataService.getSymbols();
    }

    showSymbol(symbol: string) {
        this.content = this.dataService.getDocumentation(symbol);
    }
}
