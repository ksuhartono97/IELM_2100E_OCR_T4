/**
 * Created by kristiansuhartono on 11/4/2017.
 */

FlowRouter.route("/", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "home"})
    }
});

FlowRouter.route("/upload", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "uploadcsv"})
    }
});

FlowRouter.route("/ocr", {
    action: () => {
        BlazeLayout.render("mainLayout", {mainContent: "ocr"})
    }
});