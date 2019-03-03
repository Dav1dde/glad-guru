import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, shareReplay} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private symbols: Observable<string[]>;
    private index: Observable<{[name: string]: string}>;

    constructor(private httpClient: HttpClient) {
    }

    public getSymbols(): Observable<string[]> {
        if (!this.symbols) {
            this.symbols = this.httpClient.get<string[]>('/assets/gl.json')
                .pipe(shareReplay(1))
        }

        return this.symbols;
    }

    public getIndex(): Observable<{[name: string]: string}> {
        if (!this.index) {
            this.index = this.httpClient.get<{ [name: string]: string }>(`/assets/docs/index.json`)
                .pipe(shareReplay(1));
        }

        return this.index;
    }

    public getDocumentation(name: string): Observable<string> {
        return this.getIndex()
            .pipe(
                map(index => {
                        let path = index[name.toLowerCase()];
                        if (!path) {
                            throw `symbol ${name} has no docs`
                        }
                        return path[0];
                    }
                ),
                flatMap(path => this.httpClient.get(`/assets/docs/${path}`, {responseType: 'text'}))
            )
    }
}
