console.log("Compiling script particlessimples.js ...", this);

this.Script.Init = function() {
    console.log("Init from script speak.js");
}


this.Script.Run = function() {
    //console.log("Run from script");
}

this.Script.RunParticle = function( i, dt ) {
    //console.log("RunParticle", i);
    var par = this.GetParticle(i);

    if (par) {
        if (par.selected) {
            console.log("RunParticle Selected!", i, dt, par );
        }
    }
}

this.Script.Update = function() {
    if (this.mouse) {
        //console.log("Update from script mouse:", this.mouse );
    }
}
