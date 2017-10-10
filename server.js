const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

var client = null;

wss.on('connection', function connection(ws) {
    console.log("connected");
    
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });
  ws.on('close',  function disconnection(){
      console.log("disconnected");
      client = null;
  });
  client = ws;
  ws.send('something');
});
var response = {
    'classA': {
        ids: ['ak1', 'ak2'],
        items: {
            'ak1': {
                'key':  'ak1',
                'attr1': 'value1',
                'attr2': 'value2',
                },
            'ak2': {
                'key':  'ak2',
                'attr1': 'value1',
                'attr2': 'value2',
                }    
        }
        },
    'classB': {
        ids: ['bk1', 'bk2'],
        items: {
            'bk1': {
                'key':  'bk1',
                'attr1': 'value1',
                'attr2': 'value2',
                },
            'bk2': {
                'key':  'bk2',
                'attr1': 'value1',
                'attr2': 'value2',
                }    
        }
        },
    }
 

function sendMsg() {
    if (client) {
        client.send(JSON.stringify((response)))
    }
}

var interval = setInterval(sendMsg, 1000)