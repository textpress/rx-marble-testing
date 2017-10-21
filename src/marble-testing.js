//@flow

import { Observable } from "rxjs";
import { SubscriptionLog } from "rxjs/testing/SubscriptionLog";
import { ColdObservable } from "rxjs/testing/ColdObservable";
import { HotObservable } from "rxjs/testing/HotObservable";
import { observableToBeFn, subscriptionLogsToBeFn } from "rxjs/testing/TestScheduler";

export function hot( marbles: string, values?: any, error?: any ): HotObservable<any> {
    if ( !global.rxTestScheduler ) {
        throw "tried to use hot() in async test";
    }
    return global.rxTestScheduler.createHotObservable.apply( global.rxTestScheduler, arguments );
}

export function cold( marbles: string, values?: any, error?: any ): ColdObservable<any> {
    if ( !global.rxTestScheduler ) {
        throw "tried to use cold() in async test";
    }
    return global.rxTestScheduler.createColdObservable.apply( global.rxTestScheduler, arguments );
}

export function expectObservable( observable: Observable<any>, unsubscriptionMarbles: string | null = null ): ( { toBe: observableToBeFn } ) {
    if ( !global.rxTestScheduler ) {
        throw "tried to use expectObservable() in async test";
    }
    return global.rxTestScheduler.expectObservable.apply( global.rxTestScheduler, arguments );
}

export function expectSubscriptions( actualSubscriptionLogs: SubscriptionLog[] ): ( { toBe: subscriptionLogsToBeFn } ) {
    if ( !global.rxTestScheduler ) {
        throw "tried to use expectSubscriptions() in async test";
    }
    return global.rxTestScheduler.expectSubscriptions.apply( global.rxTestScheduler, arguments );
}

export function time( marbles: string ): number {
    if ( !global.rxTestScheduler ) {
        throw "tried to use time() in async test";
    }
    return global.rxTestScheduler.createTime.apply( global.rxTestScheduler, arguments );
}
