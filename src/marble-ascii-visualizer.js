// @flow
import _ from "lodash";
import { SubscriptionLog } from "rxjs/testing/SubscriptionLog";

function eventToFrames( event: MarbleEvent ) {
    const notification = event.notification;
    let action = "?";
    switch ( notification.kind ) {
        case "N":
            action = notification.hasValue ? notification.value : "?";
            switch ( action ) {
                case "": action = "E"; break;
                case null: action = "N"; break;
                case undefined: action = "U"; break;
            }
            break;
        case "C":
            action = "|";
            break;
        case "E":
            action = "#";
            break;
    }
    return { frame: event.frame, action, char: "-" };
}

function subscriptionToFrames( log: SubscriptionLog ) {
    const result = [];
    if ( log.subscribedFrame !== Infinity )
        result.push( { frame: log.subscribedFrame, action: "^", char: " " } );

    if ( log.unsubscribedFrame !== Infinity )
        result.push( { frame: log.unsubscribedFrame, action: "!", char: " " } );
    return result;
}

function itemToFrames( item ) {
    return item instanceof SubscriptionLog
        ? subscriptionToFrames( item )
        : eventToFrames( item )
        ;
}

function visualize( rawFrames ) {
    const frameGroups = _.groupBy( rawFrames, "frame" );
    const frames = _.keys( frameGroups ).map( key => +key ).sort( ( a, b ) => a - b );
    const { string } = _.reduce( frames, ( result, frame ) => {
        const group = frameGroups[ frame ] || [];
        const actions = group.map( item => item.action );
        const chars = _.uniq( group.map( item => item.char ) );
        const char = chars.length === 1 ? chars[0] : "*";

        const actionsString = actions.length > 1
                ? `(${actions.join( "" )})`
                : actions.join()
            ;

        let padding = !result.string && frame ? char : "";
        padding += new Array( Math.floor( ( frame - result.frame ) / 10 ) ).join( char );

        result.string += padding + actionsString;

        result.frame = frame + ( actions.length > 1 ? Math.max( 0, ( actions.length + 1 ) * 10 ) : 0 );
        return result;
    }, { frame: 0, string: "" } );

    return string;
}

function visualizeArray( items ) {
    const groups = _.reduce( items, ( result, item ) => {
        const itemFrames = itemToFrames( item );
        if ( itemFrames instanceof Array ) {
            result.push( itemFrames );
            result.push( [] );
            return result;
        }
        _.last( result ).push( itemFrames );
        return result;
    }, [ [] ] );

    const result = groups
        .filter( group => !!group.length )
        .map( visualize )
        ;

    if ( !result.length )
        return "";

    if ( result.length === 1 )
        return result[0];

    return result;
}

function visualizeItem( item: MarbleEvent | SubscriptionLog ) {
    let itemFrames = itemToFrames( item );
    if ( !( itemFrames instanceof Array ) )
        itemFrames = [ itemFrames ];
    return visualize( itemFrames );
}

export default function ( value: MarbleEvent[] | SubscriptionLog ) {
    return value instanceof Array
        ? visualizeArray( value )
        : visualizeItem( value )
    ;
}
