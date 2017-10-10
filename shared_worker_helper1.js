class WebSocketManager{
    constructor() {
        if (typeof(window.SharedWorker) === 'undefined') {
            throw("Your browser does not support SharedWorkers")
          }
          // Start our new worker
          this.worker = new SharedWorker("./shared_worker8.js");
          this.worker.onerror = function(err){
            console.log(err.message);
            this.worker.port.close();
          }
    }

    register(cls_name, fn) {
        this.worker.port.postMessage({cls: cls_name});
        this.worker.port.onmessage = fn;
    }

    start() {
        this.worker.port.start();
    }
}