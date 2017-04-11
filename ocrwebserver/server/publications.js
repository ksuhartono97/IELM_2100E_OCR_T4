/**
 * Created by kristiansuhartono on 11/4/2017.
 */

Meteor.publish("imageTimestamps.all", ()=> {
    return ImageTimestamps.find();
});
