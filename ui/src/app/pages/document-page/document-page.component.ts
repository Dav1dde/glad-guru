import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, of} from "rxjs";
import {catchError, map, switchMap} from "rxjs/operators";
import {DataService} from "../../services/data.service";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
    selector: 'app-document-page',
    template: `<div [innerHTML]="document$ | async"></div>`
})
export class DocumentPageComponent implements OnInit {

    document$: Observable<string>;

    constructor(private dataService: DataService,
                private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.document$ = this.route.paramMap.pipe(
            switchMap(params => {
                return this.dataService.getDocumentation(params.get('symbol'), params.get('api'));
            }),
            map(content => this.sanitizer.bypassSecurityTrustHtml(content)),
            catchError(err => of(err.toString()))
        );
    }

}
