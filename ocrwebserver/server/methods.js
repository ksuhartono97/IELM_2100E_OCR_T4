/**
 * Created by kristiansuhartono on 11/4/2017.
 */

Meteor.methods({
    'imageTimestamps.insert' : (timeData)=> {
        ImageTimestamps.insert({type:"timeStamp", timestamp:timeData})
    },
    'wipeImageTimestamps' : () => {
        ImageTimestamps.remove({type:"timeStamp"})
    },
    'parseUpload' : (data) => {
        for ( let i = 0; i < data.length; i++ ) {
            let item   = data[ i ],
                exists = SKUData.findOne( { SkuCode: item.SkuCode } );

            if ( !exists ) {
                SKUData.insert( item );
            } else {
                console.warn( 'Rejected. This item already exists.' );
            }
        }
    },
    'wipeParseData' : () => {
        SKUData.remove({})
    }
});