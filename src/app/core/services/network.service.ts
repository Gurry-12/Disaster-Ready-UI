import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, fromEvent, merge, of, BehaviorSubject } from 'rxjs';
import { map, shareReplay, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {
    private online$ = new BehaviorSubject<boolean>(true);
    public isOnline$: Observable<boolean>;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        if (isPlatformBrowser(this.platformId)) {
            this.isOnline$ = merge(
                of(navigator.onLine),
                fromEvent(window, 'online').pipe(map(() => true)),
                fromEvent(window, 'offline').pipe(map(() => false))
            ).pipe(
                distinctUntilChanged(),
                shareReplay(1)
            );
        } else {
            this.isOnline$ = of(true);
        }
    }
}
