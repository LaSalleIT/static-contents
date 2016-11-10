/**
 *  LSTweets renderer Vue frontend
 * Formulates JSON data from the renderer and
 * displays in HTML
 * @author Alex Fang, Owen Lanphear
 * @email alex [at] lschs.org
 * @date 6/8/2016
 * @date 10/28/16
     ______________
    < BY ALEX FANG! >
     --------------
            \   ^__^
             \  (oo)\_______
                (__)\       )\/\

 */

console.log("version: tunaSavesMyLifev1.0 ");
var onePageCount = 25; //Register counter
var overrideCounterHdpi = $("#override-count-hdpi").attr('class'); // Self-defined counters
var overrideCounterMdpi = $("#override-count-mdpi").attr('class');
var overrideCounterLdpi = $("#override-count-ldpi").attr('class');
var bottomCounter = 0;

var counter = 1;
$(document).ready(function () {
$("#sma-load-more-btn").click( function() {
                    $('.hidden-binding-group-' + counter).attr('style', 'display: block;');
              counter++;
    });
});
var query = 'https://lscode.lschs.org/sma/rest/' + $('#query-settings').attr('class');
//Load Vue devtools
//that we'll never ever use,
//but just in case...
Vue.config.devtools = true;
//XHR requests + Vue rendering
var handleResponse = function (status, response) {

if(overrideCounterHdpi) {
// load from page override selector
onePageCount = overrideCounterHdpi; 
}

if(window.screen.width <= 400) {
if(overrideCounterLdpi) {
onePageCount = overrideCounterLdpi;
} else {
          onePageCount = 3; //For mobile devices
}
} else if(window.screen.width <= 700) {
if(overrideCounterMdpi) {
onePageCount = overrideCounterMdpi;
} else {
            onePageCount = 9; //For iPad Mini or equivalent
}
} //responsive layout

        var tweets = JSON.parse(response);
        var finalResult = [];
        //Link detection
        for (var i = 0; i < tweets.length; i++) {
            if (tweets[i].text) {
                if (tweets[i].text.length > 120) {
                    tweets[i].shortenedText = tweets[i].text.substring(0, 110) + "...";
                } else {
                    tweets[i].shortenedText = tweets[i].text;
                }
                tweets[i].text = tweets[i].text.autoLink();
                tweets[i].text = TwitterText.auto_link(tweets[i].text);
                tweets[i].shortenedText = tweets[i].shortenedText.autoLink();
                tweets[i].shortenedText = TwitterText.auto_link(tweets[i].shortenedText);
                tweets[i].renderedClientThumbnail = '<i class="fa fa-' + tweets[i].client + ' fa-lg"></i>';
            } else {
                tweets[i].text = ' ';
            }
            tweets[i].count = i;
        }
        if (tweets.length > onePageCount) {
            //pagintation strategy
            for (var i = 0; i < Math.floor(tweets.length / onePageCount); i++) {
                var temp = [];
                var counter = 0;
                
                for (var j = (i * onePageCount); j < ((i + 1) * onePageCount); j++) {
                    temp[counter] = tweets[j];
                    counter++;
                }
                finalResult[i] = temp;
                bottomCounter++;
            }
        } else {
            //only one page
            finalResult[0] = tweets;
            // bottomCounter is already 0
        }
        var originalText;
        if (finalResult.length > 1) {
            originalText = ' <div class="grid-item" id="vue-js-binding" v-for="tweet in tweets"> \
            <div class="grid-item-post hvr-grow"> \
        <div id="inline-media" v-if=" tweet.ifmediaexists "> \
            <img src="{{ tweet.mediaurl }} " class="img-responsive" alt="" data-toggle="modal" data-target="#{{ tweet.count }}" />  \
        </div> \
    <div class="grid-item-body" data-toggle="modal" data-target="#{{ tweet.count }}"> \
        <p class="soft-wrapping">{{{ tweet.shortenedText }}}</p> \
        <br> \
    </div> \
    <div class="grid-item-footer"> \
<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-lg"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
            <span class="icon-color"><i class="fa fa-comment fa-lg"></i></span> {{ tweet.comments }}</a></p> \
<p class="align-right"><a href="{{ tweet.url }}"><span class="icon-color">{{{ tweet.renderedClientThumbnail }}}</span></a></p> \
<div style="clear: both;"></div> \
</div> \
</div> \
<div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
    <div class="modal-dialog" role="document"> \
        <div class="modal-content"> \
          <div class="modal-body"> \
            <div style="max-width: 50%;" id="horizontal-resize"> \
              <div id="inline-media" v-if=" tweet.ifmediaexists "> \
                      <img class="align-left" src="{{ tweet.mediaurl }}" alt="" class="img-responsive"/> \
                  </div> \
            </div> \
<div style="overflow: hidden;" id="text-resize"> \
    <div class="modal-header"> \
        <i class="fa fa-times-circle-o fa-2x" data-dismiss="modal" aria-label="Close"> \
          </i> \
          <h4 class="modal-title" id="myModalLabel">{{{ tweet.renderedClientThumbnail }}}</h4> \
          </div> \
          <div class="modal-news-content"> \
                  <h4 style="padding-left: 10px; color: black;">{{{ tweet.text }}}</h4> \
          </div> \
    <br><br> \
    <div class="modal-footer"> \
  <div id="buttom-buttons"> \
    <p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-2x"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                <span class="icon-color"><i class="fa fa-comment fa-2x"></i></span> {{ tweet.comments }}</a></p> \
                    <p class="align-right"><a href="{{ tweet.url }}">Original Post</a></p> \
              </div> \
              </div> \
            </div> \
                        <div style="clear: both;"></div> \
          </div> \
        </div> \
    </div> \
</div> \
</div> \
        ';
            for (var k = 1; k < finalResult.length; k++) {
                originalText = originalText + ' <div class="grid-item hidden-binding-group-' + k + '" id="vue-js-binding-' + k + '" v-for="tweet in tweets" \
 style="display: none;"> \
 <div class="grid-item-post hvr-grow"> \
        <div id="inline-media" v-if=" tweet.ifmediaexists "> \
            <img src="{{ tweet.mediaurl }} " class="img-responsive" alt=""  data-toggle="modal" data-target="#{{ tweet.count }}"  /> \
        </div> \
    <div class="grid-item-body"  data-toggle="modal" data-target="#{{ tweet.count }}"> \
        <p class="soft-wrapping">{{{ tweet.shortenedText }}}</p> \
        <br> \
    </div> \
    <div class="grid-item-footer"> \
<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-lg"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
            <span class="icon-color"><i class="fa fa-comment fa-lg"></i></span> {{ tweet.comments }} </a></p> \
<p class="align-right"><a href="{{ tweet.url }}"><span class="icon-color"> {{{ tweet.renderedClientThumbnail }}} </span></a></p> \
<div style="clear: both;"></div> \
</div> \
</div> \
<div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
    <div class="modal-dialog" role="document"> \
       <div class="modal-content"> \
          <div class="modal-body"> \
            <div style="max-width: 50%;" id="horizontal-resize"> \
                  <div id="inline-media" v-if=" tweet.ifmediaexists "> \
                      <img class="align-left" src="{{ tweet.mediaurl }}" alt="" class="img-responsive"/> \
                  </div> \
            </div> \
            <div style="overflow: hidden;" id="text-resize"> \
                <div class="modal-header"> \
                    <i class="fa fa-times-circle-o fa-2x" data-dismiss="modal" aria-label="Close"> \
                    </i> \
                <h4 class="modal-title" id="myModalLabel">{{{ tweet.renderedClientThumbnail }}}</h4> \
            </div> \
  <div class="modal-news-content"> \
       <h4 style="color: black;">{{{ tweet.text }}}</h4> \
  </div> \
  <br><br> \
  <div class="modal-footer"> \
              <div id="buttom-buttons"> \
    <p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-2x"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                <span class="icon-color"><i class="fa fa-comment fa-2x"></i></span> {{ tweet.comments }}</a></p> \
                    <p class="align-right"><a href="{{ tweet.url }}">Original Post</a></p> \
              </div> \
              </div> \
            </div> \
            <div style="clear: both;"></div> \
          </div> \
   </div> \
</div> \
</div> \
</div> \
</div> \
';
            }
            originalText = originalText + '' +
                '</div>';
            document.getElementById("sma-widget-container").innerHTML = originalText;
            tweets = finalResult[0]; //render 0
            var twt = [];
            twt[1] = new Vue({
                el: "#vue-js-binding",
                data: {
                    tweets
                }
            });
            for (var l = 1; l < finalResult.length; l++) { //begin from 2nd
                tweets = finalResult[l];
                twt[l] = new Vue({
                    el: "#vue-js-binding-" + l,
                    data: {
                        tweets
                    }
                });
            }
        }
        else { //not
            document.getElementById("sma-widget-container").innerHTML = ' <div class="grid-item" id="vue-js-binding" \
              v-for="tweet in tweets"> \
              <div class="grid-item-post hvr-grow"> \
    <div id="inline-media" v-if=" tweet.ifmediaexists "> \
        <img src="{{ tweet.mediaurl }} " class="img-responsive" alt=""  data-toggle="modal" data-target="#{{ tweet.count }}"  /> \
    </div> \
<div class="grid-item-body"  data-toggle="modal" data-target="#{{ tweet.count }}"> \
    <p class="soft-wrapping">{{{ tweet.shortenedText }}}</p> \
    <br> \
</div> \
<div class="grid-item-footer"> \
<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-lg"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
            <span class="icon-color"><i class="fa fa-comment fa-lg"></i></span> {{ tweet.comments }} </a></p> \
 <p class="align-right"><a href="{{ tweet.url }}"><span class="icon-color"> {{{ tweet.renderedClientThumbnail }}} </span></a></p> \
<div style="clear: both;"></div> \
</div> \
</div> \
<div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
<div class="modal-dialog" role="document"> \
        <div class="modal-body"> \
          <div style="max-width: 50%;" id="horizontal-resize"> \
                <div id="inline-media" v-if=" tweet.ifmediaexists "> \
                    <img class="align-left" src="{{ tweet.mediaurl }}" alt="" class="img-responsive"/> \
                </div> \
          </div> \
  <br><br> \
<div style="overflow: hidden;" id="text-resize"> \
<div class="modal-content"> \
  <div class="modal-header"> \
          <i class="fa fa-times-circle-o fa-2x" data-dismiss="modal" aria-label="Close"> \
          </i> \
      <h4 class="modal-title" id="myModalLabel">{{{ tweet.renderedClientThumbnail }}}</h4> \
  </div> \
  <div class="modal-news-content"> \
                <h4 class="align-right" style="color: black;">{{{ tweet.text }}}</h4> \
  </div> \
  <br><br> \
  <div class="modal-footer"> \
            <div id="buttom-buttons"> \
  <p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-2x"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
              <span class="icon-color"><i class="fa fa-comment fa-2x"></i></span> {{ tweet.comments }}</a></p> \
                  <p class="align-right"><a href="{{ tweet.url }}">Original Post</a></p> \
            </div> \
            </div> \
          </div> \
          <div style="clear: both;"></div> \
   </div> \
</div> \
</div> \
</div> \
</div> \
';
            tweets = finalResult[0];
            var twtBoxRender = new Vue({
                el: "#vue-js-binding",
                data: {
                    tweets
                }
            });

     console.log("Sean is here");
     
      // if there still are more boxes, load them, and decrease bottomCounter
       $("#sma-load-more-btn").click( function() {
           console.log("Button click onalert. Current count:" + bottomCounter);
           $('.hidden-binding-group-' + counter).attr('style', 'display: block;');
           counter++;
           bottomCounter--;
           if(bottomCounter <= 0) {
            // if no more can be loaded, goto social media page (not aggregator :( )
             // http://www.lschs.org/news-events/socialmedia
             console.log("Everything loaded. Revising button element...222");
             $("#sma-load-more-btn").text("Visit Social Media Page");
             $("#sma-load-more-btn").prop('href', 'http://www.lschs.org/news-events/socialmedia');
             counter ++;
             bottomCounter = 0;
           }
      });
 }
} // end of callback function
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
var handleStateChange = function () {
    switch (xmlhttp.readyState) {
        case 0 : // UNINITIALIZED
        case 1 : // LOADING
        case 2 : // LOADED
        case 3 : // INTERACTIVE
            break;
        case 4 : // COMPLETED
            handleResponse(xmlhttp.status, xmlhttp.responseText);
            break;
        default:
            alert("error");
    }
};
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = handleStateChange;
xmlhttp.open("GET", query, true);
xmlhttp.send(null);
/* End of async call, no code shall be added here */

       $("#sma-load-more-btn").click( function() {
           console.log("Button click onalert. Current count:" + bottomCounter);
           $('.hidden-binding-group-' + counter).attr('style', 'display: block;');
           counter++;
           bottomCounter--;
           if(bottomCounter <= 0) {
            // if no more can be loaded, goto social media page (not aggregator :( )
             // http://www.lschs.org/news-events/socialmedia
             console.log("Everything loaded. Revising button element...222");
             $("#sma-load-more-btn").text("Visit Social Media Page");
             $("#sma-load-more-btn").prop('href', 'http://www.lschs.org/news-events/socialmedia');
             counter ++;
             bottomCounter = 0;
           }
      });
