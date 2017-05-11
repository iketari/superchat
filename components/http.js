'use strict';

function makeRequest (callback, data = {}, type = 'GET') {
    

    let req = new XMLHttpRequest();

    req.open(type, 'https://components-e2e6e.firebaseio.com/chat/messages.json', true);

    req.addEventListener('readystatechange', event => {
        if (req.readyState !== 4) {
            return;
        }

        let respData = JSON.parse(req.responseText);

        callback(respData);
    });

    req.send(JSON.stringify(data));
}