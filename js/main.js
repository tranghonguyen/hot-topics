/*global $, console*/
$(document).ready(function () {
    "use strict";
    var contents, url, nm, em, sb, ms, dt, err, collect, i;
    contents = {};
    // Use load method to load the home.html into index.html
    $(".bg-main .box").load("./partials/home.html", function (rsp) {
        contents["./partials/home.html"] = rsp;
    });

    function handleResponse(rsp) {
        $(".feedback").html(rsp);
    }

    function handleError(jqXHR, textStatus, errorThrown) {
        console.log("textStatus: " + textStatus + "\n" + "errorThrown: " + errorThrown);
    }

    function validateForm(ev) {
        ev.preventDefault();
        err = [];
        dt = {};
        nm = $("#full-name").val();
        em = $("#email").val();
        sb = $("#subject").val();
        ms = $("#message").val();
        // evaluate full name:
        if (nm !== "") {
            dt.full_name = nm;
        }
        else {
            err.push("Full Name?");
        }
        // evaluate email:
        if (em !== "") {
            dt.email = em;
        }
        else {
            err.push("Email?");
        }
        // evaluate subject:
        if (sb !== "") {
            dt.subject = sb;
        }
        else {
            err.push("Subject?");
        }
        // evaluate message:
        if (ms !== "") {
            dt.message = ms;
        }
        else {
            err.push("Message?");
        }
        // Check if the data is ready
        if (err.length === 0) {
            // handle ajax request
            $.ajax({
                type: "post"
                , url: "./server-side-script/web-service.php"
                , data: dt
                , dataType: "text"
            }).done(handleResponse).fail(handleError);
        }
        else {
            // report error(s)
            collect = "Please fix the following errors:";
            for (i = 0; i < err.length; i += 1) {
                collect += err[i];
            }
            $(".feedback").html(collect);
            err = [];
            collect = "";
        }
    }
    // add event listener to your form to listen for submit event
    //$("form").on("submit", validateForm);
    function storeContents(urlParam) {
        // if content already exists inside Pages
        if (contents[urlParam]) {
            // load the content from Pages
            $(".bg-main .box").html(contents[urlParam]);
        }
        else {
            // load the content by ajax request
            $(".bg-main .box").load(urlParam, function (pageRsp) {
                contents[urlParam] = pageRsp;
            });
        }
    }
    // what happens when link is clicked
    $('.bg-header .box a').on("click", function (ev) {
        ev.preventDefault();
        url = $(this).attr("href");
        /*
        test
        console.log(url); */
        storeContents(url);
        $(".bg-main .box").on("submit", "form", validateForm);
    });
});