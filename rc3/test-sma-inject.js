        /**
         *  LSTweets renderer Vue frontend
         * Formulates JSON data from the renderer and
         * displays in HTML
         * @author Alex Fang, Owen Lanphear
         * @email alex [at] lschs.org
         * @date 6/8/2016
 ______________ 
< BY ALEX FANG! >
 -------------- 
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\

         */
      
      	var onePageCount = 25; //Register counter
      
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
                
          		if(window.screen.width <= 400) {
                	onePageCount = 3; //For mobile devices
                } else if(window.screen.width <= 700) {
                	onePageCount = 9; //For iPad Mini or equivalent
                } //responsive layout
          
                var tweets = JSON.parse(response);
                var finalResult = [];
                console.log(tweets);
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
                    }
                } else {
                    //only one page
                    finalResult[0] = tweets;
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
		 <p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-lg"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                    <span class="icon-color"><i class="fa fa-comment fa-lg"></i></span> {{ tweet.comments }}</a></p> \
		 <p class="align-right"><a href="{{ tweet.url }}"><span class="icon-color">{{{ tweet.renderedClientThumbnail }}}</span></a></p> \
		 <div style="clear: both;"></div> \
		 </div> \
        <div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
            <div class="modal-dialog" role="document"> \
               <div class="modal-content"> \
                <div style="max-width: 50%;" class="align-left" id="horizontal-resize"> \
                  <div id="inline-media" v-if=" tweet.ifmediaexists "> \
                        <img class="align-left" src="{{ tweet.mediaurl }}" alt="" class="img-responsive"/> \
                  </div> \
                </div> \
                <div style="max-width: 50%;" id="horizontal-resize" class="align-right"> \
                    <div class="modal-header"> \
                        <i class="fa fa-times-circle-o fa-2x" data-dismiss="modal" aria-label="Close"> \
                        </i> \
                    <h4 class="modal-title" id="myModalLabel">{{{ tweet.renderedClientThumbnail }}}</h4> \
                   </div> \
                	<div class="modal-body"> \
						<br><br> \
				<div style="overflow: hidden;" id="text-resize"> \
                    			<h4 style="padding-left: 10px; color: black;">{{{ tweet.text }}}</h4> \
						<br><br> \
					<div id="buttom-buttons"> \
						<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-2x"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                				<span class="icon-color"><i class="fa fa-comment fa-2x"></i></span> {{ tweet.comments }}</a></p> \
                    				<p class="align-right"><a href="{{ tweet.url }}">Original Post</a></p> \
                			</div> \
                		</div> \
                	</div> \
                	<div class="modal-footer"> \
				  <div style="clear: both;"></div> \
                	</div> \
                </div> \
               </div> \
               <div style="clear: both;"></div> \
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
		<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-lg"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                    <span class="icon-color"><i class="fa fa-comment fa-lg"></i></span> {{ tweet.comments }} </a></p> \
      	<p class="align-right"><a href="{{ tweet.url }}"><span class="icon-color"> {{{ tweet.renderedClientThumbnail }}} </span></a></p> \
		<div style="clear: both;"></div> \
	</div> \
        <div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
            <div class="modal-dialog" role="document"> \
                <div class="modal-content"> \
                    <div class="modal-header"> \
                        <i class="fa fa-times-circle-o fa-2x" data-dismiss="modal" aria-label="Close"> \
                        </i> \
                    <h4 class="modal-title" id="myModalLabel">{{{ tweet.renderedClientThumbnail }}}</h4> \
                </div> \
                	<div class="modal-body"> \
                		<div style="max-width: 50%;" id="horizontal-resize"> \
                    			<div id="inline-media" v-if=" tweet.ifmediaexists "> \
                        			<img class="align-left" src="{{ tweet.mediaurl }}" alt="" class="img-responsive"/> \
                    			</div> \
               			</div> \
                    							<br><br> \
                		<div style="overflow: hidden;" id="text-resize"> \
					<h4 style="padding-left: 10px; max-width: 50%; color: black;">{{{ tweet.text }}}</h4> \
					<br><br> \
                			<div id="buttom-buttons"> \
						<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-2x"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                				<span class="icon-color"><i class="fa fa-comment fa-2x"></i></span> {{ tweet.comments }}</a></p> \
                    				<p class="align-right"><a href="{{ tweet.url }}">Original Post</a></p> \
                			</div> \
                		</div> \
                	</div> \
                <div class="modal-footer"> \
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
		 <p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-lg"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                    <span class="icon-color"><i class="fa fa-comment fa-lg"></i></span> {{ tweet.comments }} </a></p> \
      	 <p class="align-right"><a href="{{ tweet.url }}"><span class="icon-color"> {{{ tweet.renderedClientThumbnail }}} </span></a></p> \
		 <div style="clear: both;"></div> \
		 </div> \
    <div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"> \
        <div class="modal-dialog" role="document"> \
            <div class="modal-content"> \
                <div class="modal-header"> \
                        <i class="fa fa-times-circle-o fa-2x" data-dismiss="modal" aria-label="Close"> \
                        </i> \
                    <h4 class="modal-title" id="myModalLabel">{{{ tweet.renderedClientThumbnail }}}</h4> \
                </div> \
                <div class="modal-body"> \
                	<div style="max-width: 50%;" id="horizontal-resize"> \
                    		<div id="inline-media" v-if=" tweet.ifmediaexists "> \
                        		<img class="align-left" src="{{ tweet.mediaurl }}" alt="" class="img-responsive"/> \
                    		</div> \
                	</div> \
					<br><br> \
			<div style="overflow: hidden;" id="text-resize"> \
                    		<h4 class="align-right" style="color: black;">{{{ tweet.text }}}</h4> \
					<br><br> \
                		<div id="buttom-buttons"> \
					<p class="align-left"><a href="{{ tweet.url }}"><span class="icon-color"><i class="fa fa-thumbs-up fa-2x"></i></span> {{ tweet.likes }} &nbsp;&nbsp; \
                			<span class="icon-color"><i class="fa fa-comment fa-2x"></i></span> {{ tweet.comments }}</a></p> \
                    			<p class="align-right"><a href="{{ tweet.url }}">Original Post</a></p> \
                		</div> \
                	</div> \
        	 </div> \
        	<div class="modal-footer"> \
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
        $(document).ready(function () {
			$("#sma-load-more-btn").click( function() {
                            $('.hidden-binding-group-' + counter).attr('style', 'display: block;');
                			counter++;
            });
        });
        $(document).ready(function () {
			$("#sma-load-more-btn").click( function() {
                            $('.hidden-binding-group-' + counter).attr('style', 'display: block;');
                			counter++;
            });
        });
                    console.log('Here before loading masonry');
                    //Masonry jQuery plugin
                    $('.grid').masonry({
                      // options
                      itemSelector: '.grid-item',
                      // use element for option
                      columnWidth: '.grid-sizer',
                      percentPosition: true
                    });
                    console.log('Here after loading masonry');
                }
            }
            ;
        //
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
