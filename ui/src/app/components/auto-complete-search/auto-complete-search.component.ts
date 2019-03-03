import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DOCUMENT} from "@angular/common";
import {Observable} from "rxjs";

@Component({
    selector: 'app-auto-complete-search',
    templateUrl: './auto-complete-search.component.html',
    styleUrls: ['./auto-complete-search.component.scss']
})
export class AutoCompleteSearchComponent {
    @Output()
    public itemSelected = new EventEmitter<string>();

    @Input()
    public caseSensitive = false;

    private _values: string[];
    @Input()
    set values(values: string[]) {
        this._values = values;
        this._autocomplete = this._values || [];
    }
    get values() {
        return this._values;
    }

    @ViewChild('container')
    private containerEl: ElementRef;
    private oldFilter: string;

    public focused = false;
    public searchValue = "";

    private _autocomplete: string[];

    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    get autocomplete() {
        return this._autocomplete;
    }

    get showDropdown() {
        return this.focused && this._autocomplete.length != 0;
    }

    onInput(input: string) {
        let regex = new RegExp(input, 'i');
        let data = this.values;
        if (this.oldFilter && input.match(this.oldFilter)) {
            data = this._autocomplete;
        }
        this._autocomplete = data.filter(data => data.match(regex));
        this.oldFilter = input;
    }

    onSelect(value: string) {
        this._autocomplete = [];
        this.searchValue = value;

        this.itemSelected.emit(this.searchValue);
    }

    onFocus(event) {
        if (event.type == 'focusout' && this.containerEl.nativeElement.contains(event.relatedTarget)) {
            this.focused = true;
        } else {
            this.focused = event.type == 'focusin';
        }
    }

    onKeyPress(code: string) {
        if (code == 'Enter') {
            this.itemSelected.emit(this.searchValue);
        }
    }
}
