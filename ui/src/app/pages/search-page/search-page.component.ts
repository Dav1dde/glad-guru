import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {Observable} from "rxjs";
import {flatMap, map, tap} from "rxjs/operators";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-search-page',
    templateUrl: './search-page.component.html',
    styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent implements OnInit {
    content: Observable<string>;

    initialTerm$: Observable<string>;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private dataService: DataService) {
    }

    ngOnInit(): void {
        this.initialTerm$ = this.route.queryParamMap.pipe(
            map(params => params.get('q') || '')
        );
    }

    search = (term$: Observable<string>) => {
        return term$.pipe(
            tap(term => {
                this.router.navigate([], {
                    relativeTo: this.route,
                    queryParams: term ? {'q': term} : {},
                    queryParamsHandling: 'merge',
                    replaceUrl: true
                })
            }),
            flatMap(term => {
                return this.dataService.getSymbols().pipe(
                    map(symbols => {
                        if (!term) {
                            return [];
                        }
                        return symbols
                            .filter(s => s.toLowerCase().includes(term.toLowerCase()))
                            .slice(0, 15);
                    })
                );
            })
        );
    };
}
