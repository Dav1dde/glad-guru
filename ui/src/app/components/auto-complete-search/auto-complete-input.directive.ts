import {Directive, ElementRef} from '@angular/core';
import {fromEvent, Observable} from "rxjs";
import {map} from "rxjs/operators";

@Directive({
    selector: 'input[appAutoCompleteInput]',
    host: {
        'autocomplete': 'off',
        'autocapitalize': 'off',
        'autocorrect': 'off',
    }
})
export class AutoCompleteInputDirective {
    public content$: Observable<string>;

    constructor(private _elementRef: ElementRef<HTMLInputElement>) {
        this.content$ = fromEvent<Event>(_elementRef.nativeElement, 'input')
            .pipe(map($event => ($event.target as HTMLInputElement).value));
    }
}
