// @flow
import visualizer from "../marble-ascii-visualizer";
import { TestScheduler } from "rxjs/testing/TestScheduler";

describe( "marble-ascii-visualizer", () => {

    function testEvents( description, expected ) {
        it( description, () => {
            const marbles = TestScheduler.parseMarbles( expected );
            expect( visualizer( marbles ) ).toEqual( expected );
        } );
    }

    function testSubscription( description, expected ) {
        it( description, () => {
            const marbles = TestScheduler.parseMarblesAsSubscriptions( expected );
            expect( visualizer( marbles ) ).toEqual( expected );
        } );
    }

    function testSubscriptionArray( description, input, expected ) {
        it( description, () => {
            const marbles = input.map( ( input ) => TestScheduler.parseMarblesAsSubscriptions( input ) );
            expect( visualizer( marbles ) ).toEqual( expected );
        } );
    }

    it( "visualises empty/null/undefined values", () => {
        const marbles: MarbleEvent[] = [
            { frame: 0, notification: { kind: "N", hasValue: true, value: "" } },
            { frame: 10, notification: { kind: "N", hasValue: true, value: null } },
            { frame: 20, notification: { kind: "N", hasValue: true, value: undefined } },
        ];
        expect( visualizer( marbles ) ).toEqual( "ENU" );
    } );

    testEvents( "handles for empty event sequence", "" );
    testEvents( "handles single event at the beginning", "a" );
    testEvents( "handles single event not at the beginning", "--a" );
    testEvents( "handles multiple consequent events", "abc" );
    testEvents( "handles multiple non consequent events", "a---bc-d" );
    testEvents( "handles stream end", "a---b-c--|" );
    testEvents( "handles exceptions", "ab-c-#" );
    testEvents( "handles event groups at the beginning", "(ab)-|" );
    testEvents( "handles event groups in the middle", "--(ab)-|" );
    testEvents( "handles event groups at the end", "--(ab|)" );
    testEvents( "handles multiple event groups", "(ab)(ab)-(ab)-(ab)(ab)-(ab|)" );
    testEvents( "handles mix of single events and groups", "a-a(ab)-(ab)a-a(ab)a-aa(ab)aa-a(ab)(ab)a-a(ab)a(ab)a|" );

    testSubscription( "handles for empty event subscription", "" );
    testSubscription( "handles subscription from the beginning", "^   !" );
    testSubscription( "handles subscription from the middle", "  ^ !" );
    testSubscription( "handles unsubscription only", "  !" );
    testSubscription( "handles subscription only", "  ^" );

    testSubscriptionArray( "handles empty array", [], "" );
    testSubscriptionArray( "handles array with one item", [ "^ !" ], "^ !" );
    testSubscriptionArray( "handles array with two items", [ "^ !", "^    !" ], [ "^ !", "^    !" ] );
} );
