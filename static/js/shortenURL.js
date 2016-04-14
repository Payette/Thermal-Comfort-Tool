function shorten(url, callback) {

    var access_token = 'bfca9a1c33760cf6e143343be11597b8d05f74b7',
    api_url = 'https://api-ssl.bitly.com';
    // if the call to load the api_key  and api_url has not yet returned, 
    // and the key/url are still null do not try to shorten
    if(!access_token || !api_url) { console.log("returning... not yet initialized"); return; } 

    // make sure that the required parameters  are included
    if(!url || !callback) { throw "Attempt to call shorten without a url or a callback function"; }

    // here is where the call to the bitly api would go
    // with the callback method that was passed in used as the success handler
    // for example ( using jquery )
    $.getJSON(api_url+'/v3/shorten?access_token=' + access_token + '&longUrl=' + encodeURIComponent(url), callback);

}



