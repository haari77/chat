Tail = require('tail').Tail;
let tail = new Tail('sample.txt');

tail.on("line", function(data) {
    console.log(data);
    data=''
  });
  
  tail.on("error", function(error) {
    console.log('ERROR: ', error);
  });