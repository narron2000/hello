var current_n = 0;
var cnt = Math.max($(".menuitem").length,1);
var windowWidth = 0;
setWindowWidth();
var networkTimeID = null;
var compassID = null;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        $("#contextdiv").css({"height":$(window).height()-51});
        $("#exit").addClass("pull-right").unbind("click").bind("click",function(){
            $(this).animate({"color":"#FF3366"},500,"ease-in",function(){
                navigator.app.exitApp();
            });
        });
        $(".menuitem").unbind("click").bind("click",function(){
            var n = $(this).attr("n");
            $(".menuitem .text-active").removeClass("text-active");
            $("#menuitemi"+n).addClass("text-active");
            current_n = parseInt(n+"");
            $("#container").scrollLeft(current_n*windowWidth);
        });
        $(".linkitem").unbind("click").bind("click",function(){
            var linkurl = $(this).attr("link");
            $(this).children("*:nth-child(1)").animate({"color":"#FF3366"},50,"ease-in",function(){
                $(this).animate({"color":"#0099FF"},500,"ease-in",function(){
                    $("#container,.menuitem").hide();
                    $("#windiv,#return").show();
                    $.get("pages/"+linkurl, function(response){
                      $("#contextdiv").empty().append(response);
                    });
                });
            });
        });
         $("#return").unbind("click").bind("click",function(){
            $(this).animate({"color":"#0099FF"},500,"ease-in",function(){
                $("#windiv,#return").hide();
                $("#container,.menuitem").show();
                $("#container").scrollLeft(current_n*windowWidth);
                $(this).css({"color":"#777777"});
                if (networkTimeID!=null){
                    clearInterval(networkTimeID);
                }
                if (compassID!=null){
                    navigator.compass.clearWatch(compassID);
                }
                $("#contextdiv").empty();
            });
        });
        var hammer = new Hammer(document.getElementById("container"));
        hammer.on("panleft", function(e) {
            if (Math.abs(e.deltaX)>10){
                hammer.stop();
                current_n = (current_n + 1>=cnt)?(cnt-1):(current_n + 1);
                $(".menuitem .text-active").removeClass("text-active");
                $("#menuitemi"+current_n).addClass("text-active");
                panAnimate();
            }
        });

        hammer.on("panright", function(e) {
            if (Math.abs(e.deltaX)>10){
                hammer.stop();
                current_n = (current_n - 1>0)?(current_n - 1):0;
                $(".menuitem .text-active").removeClass("text-active");
                $("#menuitemi"+current_n).addClass("text-active");
                panAnimate();
            }
        });
    }
};

function setWindowWidth(){
    windowWidth = $(window).width();
    if (windowWidth<1){
        setTimeout("setWindowWidth()",10);
    }
}

function panAnimate(){
    var source = $("#container").scrollLeft()*cnt;
    var target = current_n*windowWidth*cnt;
    var distance = windowWidth/2;
    if (source>target){
        var cleft = source-distance>target?(source-distance):target;
        $("#container").scrollLeft(cleft/cnt);
        setTimeout("panAnimate()",30);
    }
    else if (source<target){
        var cleft = source+distance<target?(source+distance):target;
        $("#container").scrollLeft(cleft/cnt);
        setTimeout("panAnimate()",30);
    }
    else{
        return false;
    }
}

app.initialize();


