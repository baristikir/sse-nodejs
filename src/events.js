const EventEmitter = require("events");
const emitter = new EventEmitter();
emitter.setMaxListeners(100000);
const EventSerializer = (event, data) => {
  const jsonString = JSON.stringify(data);
  return `event: ${event}\ndata: ${jsonString}\n\n`;
};

let eventCounter = 0;
const listen = (res) => {
  // emitter.on("update", () => {
  //   eventCounter++;
  //   console.log(`Already sent ${eventCounter} times`);
  //   console.log("Sending Update Notification to all Clients!");
  //   res.write("New Update!");
  //   res.end();
  // });
};

const trigger = () => {
  emitter.emit("update", () => {
    console.log("Someone pushed a change!");
  });
};

const clear = () => {
  clearInterval(eventCounter);
};

exports.listen = listen;
exports.trigger = trigger;
exports.clear = clear;
