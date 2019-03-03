import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AutoCompleteSearchComponent} from './auto-complete-search.component';

describe('AutoCompleteSearchComponent', () => {
    let component: AutoCompleteSearchComponent;
    let fixture: ComponentFixture<AutoCompleteSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AutoCompleteSearchComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AutoCompleteSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
