/**
 * Created by kristiansuhartono on 11/4/2017.
 */

FlowRouter.route("/", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "home"})
    }
});
