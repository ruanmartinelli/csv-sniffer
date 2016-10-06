const forever = require('forever-monitor');

var child = new (forever.Monitor)('./index.js', {
    // silent: true
});

child.on('exit', (forever)          => {});
child.on('restart', (forever)       => {});
child.on('start', (process, data)   => console.log("[FOREVER] Start..."));
child.on('stop', (process)          => console.log("[FOREVER] STOP!") );
child.on('error', (err)             => console.log("[FOREVER] ERROR!", err));


child.start();
