import {
    Component,
    ContentChild,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from '@angular/core';
import {concat, Observable, of, Subscription} from "rxjs";
import {AutoCompleteInputDirective} from "./auto-complete-input.directive";

@Component({
    selector: 'app-auto-complete-search',
    template: `
        <div class="container"
             (focusin)="onFocus($event)"
             (focusout)="onFocus($event)"
             #container
        >
            <ng-content></ng-content>

            <ng-container
                [ngTemplateOutlet]="template"
                [ngTemplateOutletContext]="{'$implicit': results$ | async, 'active': isActive}">
            </ng-container>
        </div>
    `,
    styles: [
        '.container { position: relative; }',
    ]
})
export class AutoCompleteSearchComponent implements OnInit, OnDestroy {
    @Output()
    public itemSelected = new EventEmitter<string>();
    @Input()
    public search: (text: Observable<string>) => Observable<any[]>;
    @Input()
    public autoHide: boolean = true;
    @Input()
    public initialTerm: string = '';
    @ContentChild(TemplateRef)
    public template: TemplateRef<any>;
    @ContentChild(AutoCompleteInputDirective)
    public input: AutoCompleteInputDirective;
    @ViewChild('container')
    private containerEl: ElementRef;

    public results$: Observable<any[]>;
    private _resultSubscription: Subscription;

    private hasValues = false;
    public focused = false;

    constructor() {
    }

    ngOnInit(): void {
        this.input.setValue(this.initialTerm);

        this.results$ = concat(of(this.initialTerm), this.input.content$).pipe(this.search);

        this._resultSubscription = this.results$.subscribe(values => {
            this.hasValues = !!values && !!values.length;
        });
    }

    ngOnDestroy(): void {
        this._resultSubscription.unsubscribe();
    }

    get isActive() {
        return !this.autoHide || (this.hasValues && this.focused);
    }

    onFocus(event) {
        if (event.type == 'focusout' && this.containerEl.nativeElement.contains(event.relatedTarget)) {
            this.focused = true;
        } else {
            this.focused = event.type == 'focusin';
        }
    }
}
