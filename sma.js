
        /**
         *  LSTweets renderer Vue frontend
         * Formulates JSON data from the renderer and
         * displays in HTML
         * @author Alex Fang
         * @email alex [at] lschs.org
         * @date 6/8/2016
         */

function load(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

//LOAD
	load('https://lasalleit.github.io/static-contents/bootstrap.css', 'css');
	load('https://lasalleit.github.io/static-contents/jquery.js', 'js');
	load('https://lasalleit.github.io/static-contents/bootstrap.js', 'js');
	load('https://lasalleit.github.io/static-contents/vue.js', 'js');
	load('https://lasalleit.github.io/static-contents/jquery.min.js', 'js');
	load('https://lasalleit.github.io/static-contents/autolink.js', 'js');
	load('https://lasalleit.githbu.io/static-contents/twitter-text.js', 'js');
	load('https://lasalleit.github.io/static-contents/narrow.css', 'css');
	load('https://lasalleit.github.io/static-contents/sma.css', 'css');

	document.getElementById("sma-widget-container").innerHTML = `
  <div class="container">
    <div id="vue-js-binding" v-for="tweet in tweets">
        <!-- Button trigger modal -->
        <div class="col-md-4 vcenter">
            <p class="soft-wrapping">{{{ tweet.shortenedText }}}</p>
            <div id="inline-media" v-if=" tweet.ifmediaexists "><img src="{{ tweet.mediaurl }} " class="img-thumbnail"
                                                                     alt=""/></div>
            <br>
            <button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#{{ tweet.count }}">
                View details
            </button>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="{{ tweet.count }}" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
             aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4 class="modal-title" id="myModalLabel">{{{ tweet.source }}}</h4>
                    </div>
                    <div class="modal-body">
                        {{{ tweet.text }}}
                        <div id="inline-media" v-if=" tweet.ifmediaexists ">
                            <img src="{{ tweet.mediaurl }}" alt="" class="img-thumbnail"/>
                        </div>
                        <hr>
                        <p>Likes: {{ tweet.likes }}</p>
                        <p>Comments: {{ tweet.comments }}</p>
                        <a href="{{ tweet.url }}">Original Post</a>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</div>
		`;

        var query = '//lscode.lschs.org/sma/rest/' + $('#query-settings').attr('class');

        Vue.config.devtools = true;

        //XHR requests + Vue rendering
        var handleResponse = function (status, response) {

            var tweets = JSON.parse(response);
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
                } else {
                    tweets[i].text = ' ';
                }
                tweets[i].count = i;
            }

            var twtBoxRender = new Vue({
                el: "#vue-js-binding",
                data: {
                    tweets
                }
            })

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

