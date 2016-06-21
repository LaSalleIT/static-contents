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
load('https://lasalleit.github.io/static-contents/bootstrap.css', 'css');
load('https://lasalleit.github.io/static-contents/jquery.js', 'js');
load('https://lasalleit.github.io/static-contents/bootstrap.js', 'js');
load('https://lasalleit.github.io/static-contents/vue.js', 'js');
load('https://lasalleit.github.io/static-contents/jquery.min.js', 'js');
load('https://lasalleit.github.io/static-contents/autolink.js', 'js');
load('https://lasalleit.githbu.io/static-contents/twitter-text.js', 'js');
load('https://lasalleit.github.io/static-contents/narrow.css', 'css');
load('https://lasalleit.github.io/static-contents/sma.css', 'css');
document.getElementById("sma-widget").innerHTML='<object type="text/html" data="https://lscode.lschs.org/sma/views/vue?query='+ 
document.getElementById("sma-widget-query") +'"></object>';

