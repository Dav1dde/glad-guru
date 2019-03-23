import {Component} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";
import {flatMap, map} from "rxjs/operators";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
    content: Observable<string>;

    constructor(private dataService: DataService) {
    }

    search = (term$: Observable<string>) => {
        return term$.pipe(
            flatMap(term => {
                return this.dataService.getSymbols().pipe(
                    map(symbols => symbols.filter(s => s.startsWith(term)).slice(0, 15))
                );
            })
        );
    };
}
