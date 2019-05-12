import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable, of} from "rxjs";
import {catchError, flatMap, map, share, switchMap, tap} from "rxjs/operators";
import {DataService} from "../../services/data.service";
import {DomSanitizer, SafeHtml, Title} from "@angular/platform-browser";
import {Location} from "@angular/common";

@Component({
    selector: 'app-document-page',
    template: `
        <a href="javascript:void(0)" (click)="back()">Back</a>
        <div *ngIf="symbol$ | async as symbol">
            <ul>
                <li>Name: {{ symbol.name }}</li>
                <li *ngIf="symbol.api">API: {{ symbol.api }}</li>
                <li>Type: {{ symbol.type }}</li>
                <li *ngIf="symbol.alias && symbol.alias.length">
                    Alias:
                    <ng-container *ngFor="let alias of symbol.alias; let isLast=last">
                        <a [routerLink]="['/' + alias]">{{ alias }}</a>{{ isLast ? '' : ', ' }}
                    </ng-container>
                </li>
            </ul>
        </div>
        <div [innerHTML]="document$ | async"></div>
    `
})
export class DocumentPageComponent implements OnInit {
    symbol$: Observable<any>;
    document$: Observable<SafeHtml>;

    constructor(private dataService: DataService,
                private titleService: Title,
                private route: ActivatedRoute,
                private sanitizer: DomSanitizer,
                private location: Location) {
    }

    ngOnInit() {
        this.document$ = this.route.paramMap.pipe(
            flatMap(params => {
                return this.dataService.getDocumentation(params.get('symbol'), params.get('api'))
                    .pipe(catchError(err => of(err.toString())));
            }),
            map(content => this.sanitizer.bypassSecurityTrustHtml(content)),
        );

        this.symbol$ = this.route.paramMap.pipe(
            switchMap(params => {
                return this.dataService.getSymbol(params.get('symbol'))
            }),
            share()
        );

        this.route.paramMap.subscribe(params => this.titleService.setTitle(params.get('symbol') + ' - glad guru'));
    }

    back() {
        this.location.back();
    }
}
