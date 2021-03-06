import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {combineLatest, Observable} from "rxjs";
import {map, share, shareReplay} from "rxjs/operators";
import {flatMap} from "rxjs/internal/operators";

@Injectable({
    providedIn: 'root'
})
export class DataService {
    private symbols: Observable<string[]>;
    private index: Observable<{[name: string]: string[]}>;

    constructor(private httpClient: HttpClient) {
    }

    public getSymbols(): Observable<string[]> {
        if (!this.symbols) {
            let gl$ = this.httpClient.get<string[]>('/assets/gl.json');
            let vk$ = this.httpClient.get<string[]>('/assets/vk.json');
            this.symbols = combineLatest(gl$, vk$)
                .pipe(map(([gl, vk]) => [...gl, ...vk]), share())
        }

        return this.symbols;
    }

    public getIndex(): Observable<{[name: string]: string[]}> {
        if (!this.index) {
            this.index = this.httpClient.get<{ [name: string]: string[] }>(`/assets/docs/index.json`)
                .pipe(share());
        }

        return this.index;
    }

    public getDocumentation(name: string, api: string = null): Observable<string> {
        return this.getIndex()
            .pipe(
                map(index => {
                        let path = index[name.toLowerCase()];
                        if (!path) {
                            throw `symbol ${name} has no docs`
                        }

                        if (api != null) {
                            let selected = path.find(f => f.startsWith(api + '/'));
                            if (!selected) {
                                throw `symbol ${name} has no docs for api ${api}`
                            }
                            return selected;
                        } else {
                            return path[0];
                        }
                    }
                ),
                flatMap(path => this.httpClient.get(`/assets/docs/${path}`, {responseType: 'text'}))
            )
    }

    public getSymbol(name: string): Observable<any> {
        return this.httpClient.get<any>(`/assets/symbols/${name}.json`).pipe(share())
    }
}
