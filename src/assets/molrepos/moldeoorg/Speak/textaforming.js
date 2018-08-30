console.log("Compiling script textaforming.js ...", this);

this.Script.Init = function() {
    this.StartRaycaster = true;
    console.log("Init from script textaforming.js",this);

}


this.Script.Run = function() {
    //console.log("Run from script");
}

this.Script.RunParticle = function( i, dt ) {
    //console.log("RunParticle", i);
    var par = this.GetParticle(i);

    if (par) {
        if (par.selected) {
            //console.log("RunParticle Selected!", i, dt, par );
            //console.log("this:",this);
            //console.log("Console:");
            console.log("textaforming Console Par:",par,this);
            par.Color.r = 2.0;
            par.Color.g = 2.0;
            par.Color.b = 2.0;
        }
    }
}

this.Script.Update = function() {
    if (this.mouse) {
        //console.log("Update from script mouse:", this.mouse );
    }
}
