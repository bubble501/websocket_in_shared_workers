var socket = new WebSocket("ws://localhost:8080");
var clients = [];
var key2Client = new Map();


class EventManager {
    constructor() {
        this.classMap = new Map();
        this.classObjectMap = new Map();
    }

    registerClass(cls, page) {
        if (this.classMap.has(cls)===false) {
            this.classMap.set(cls, []);
        }
        
        this.classMap.get(cls).push(page);
    }

    registerClassKey(cls, key, page) {
        if (this.classObjectMap.has(cls)===false) {
            this.classObjectMap.set(cls, new Map());
        }

        var innerClassMap = this.classObjectMap[cls];
        if (innerClassMap.has(key)===false) {
            innerClassMap.set(key, []);
        }

        innerClassMap[key].push(page)
    }

    postClassMsg(content, cls, client){
        var msg = {
            msg_type: 'cls',
            msg_cls:  cls,
            msg_content: content
        };

        client.postMessage(msg);
    }

    postObjectMsg(content, cls, key, client) {
        var msg = {
            msg_type: 'obj',
            msg_cls: cls,
            msg_key: key,
            msg_content: content
        }
        client.postMessage(msg);
    }

    postEvent(event) {
        //post event based on the class.
        var response = JSON.parse(event.data);
        for (var cls in response) {
            if (this.classMap.has(cls)===true) {
                this.classMap.get(cls).forEach((client) =>
                {
                    this.postClassMsg(response[cls], cls, client)
                }) 
            }

            
            if (this.classObjectMap.has(cls)===true) {
                var innerClassMap = this.classObjectMap.get(cls);
                records.forEach(function(record){
                    for (var [key, obj] of record) {
                        if(innerClassMap.has(key)===false) {
                            innerClassMap.forEach(function(client) {
                                client.postMessage(obj);
                            })
                        }
                    }
                })
            }
        }        

    }

}


console.log("shared object start!");
var em = new EventManager()

self.addEventListener("connect", function(evt) {
    var client = evt.ports[0];
    clients.push(client);

    client.start();
    client.addEventListener('message', function(evt){
        console.log("received data %s from client page", evt.data);
        if ('cls' in evt.data) {
            if ('key' in evt.data) {
                em.registerClassKey(evt.data.cls, evt.data.key, client);
            }
            else {
                em.registerClass(evt.data.cls, client);
            }    
        }
    });
});

socket.onmessage = function (evt) {
    em.postEvent(evt);
    // clients.forEach(function(client){
    //     client.postMessage(evt.data)
    // })
}