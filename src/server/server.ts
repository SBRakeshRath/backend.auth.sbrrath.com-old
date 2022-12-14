import http from "http";
import app from "./app.js";



var port = normalizePort(process.env.PORT);

app.set("port", port);


var server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);



function normalizePort(val:any) {
    var port = parseInt(val, 10);
    if (isNaN(port)) {
      // named pipe
      return val;
    }
  
    if (port >= 0) {
      // port number
      return port;
    }
  
   
    return false;
  }
  
  /**
   * Event listener for HTTP server "error" event.
   */
  
  function onError(error:any) {
    if (error.syscall !== "listen") {
      throw error;
    }
  
    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  
    // handle specific listen errors with friendly messages
    switch (error.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges");
        process.exit(1);
        break;
      case "EADDRINUSE":
        console.error(bind + " is already in use");
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
  
  /**
   * Event listener for HTTP server "listening" event.
   */
  
  function onListening() {
    var addr = server.address();
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
    console.log("listening on port :- " + bind);
    //    debug('Listening on ' + bind);
  }