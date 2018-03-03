console.log("Compiling script speak.js ...", this);

this.Script.Init = function() {
    console.log("Init __console__ script: speak.js");
}


this.Script.Run = function() {
    console.log("Run from script __console__");
}

this.Script.Update = function() {
//    if (this.mouse) {
//        console.log("Update from script mouse:", this.mouse );
//    }
}
