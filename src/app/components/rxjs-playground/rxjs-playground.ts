import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, Subscription, interval, map } from 'rxjs';

@Component({
  selector: 'app-rxjs-playground',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './rxjs-playground.html',
  styleUrl: './rxjs-playground.css',
})
export class RxjsPlaygroundComponent implements OnDestroy {
  value$ = new BehaviorSubject<number>(0);
  isRunning = false;

  private counterSubscription?: Subscription;

  start(): void {
    if (this.counterSubscription && !this.counterSubscription.closed) {
      return;
    }

    this.isRunning = true;
    this.value$.next(0);
    this.counterSubscription = interval(1000)
      .pipe(map((val) => (val + 1) * 10))
      .subscribe((val) => {
        this.value$.next(val);
      });
  }

  stop(): void {
    this.counterSubscription?.unsubscribe();
    this.counterSubscription = undefined;
    this.isRunning = false;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
