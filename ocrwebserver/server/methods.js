/**
 * Created by kristiansuhartono on 11/4/2017.
 */

Meteor.methods({
    'imageTimestamps.insert' : (timeData)=> {
        ImageTimestamps.insert({type:"timeStamp", timestamp:timeData})
    },
    'wipeImageTimestamps' : () => {
        ImageTimestamps.remove({type:"timeStamp"})
    }
});