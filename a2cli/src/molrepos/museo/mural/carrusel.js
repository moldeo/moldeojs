console.log("Compiling script...", this);

this.Script["dbready"] = false;
this.Script["dbindex"] = {};
this.Script["particle_selected_index"] = -1;
this.Script["particle_unselected_index"] = -1;
this.Script["ptimer"] = new this.Script.moTimer();
this.Script["ptimer_tofront"] = 1000;
this.Script["VPx"] = 0.0;
this.Script["VPy"] = 0.0;
this.Script["VPz"] = 0.0;
this.Script["zFront"] = -1.0;
//this.Script.Timer = new moTimer();
this.Script["EasingFunctions"] = {
  // no easing, no acceleration
  linear: function(t) { return t },
  // accelerating from zero velocity
  easeInQuad: function(t) { return t * t },
  // decelerating to zero velocity
  easeOutQuad: function(t) { return t * (2 - t) },
  // acceleration until halfway, then deceleration
  easeInOutQuad: function(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t },
  // accelerating from zero velocity
  easeInCubic: function(t) { return t * t * t },
  // decelerating to zero velocity
  easeOutCubic: function(t) { return (--t) * t * t + 1 },
  // acceleration until halfway, then deceleration
  easeInOutCubic: function(t) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 },
  // accelerating from zero velocity
  easeInQuart: function(t) { return t * t * t * t },
  // decelerating to zero velocity
  easeOutQuart: function(t) { return 1 - (--t) * t * t * t },
  // acceleration until halfway, then deceleration
  easeInOutQuart: function(t) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t },
  // accelerating from zero velocity
  easeInQuint: function(t) { return t * t * t * t * t },
  // decelerating to zero velocity
  easeOutQuint: function(t) { return 1 + (--t) * t * t * t * t },
  // acceleration until halfway, then deceleration
  easeInOutQuint: function(t) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }
};

this.Script.Interpol = function( MOB, src, dst, f) {
  return src + (dst - src) * MOB.Script.EasingFunctions.easeInOutQuad( Math.min( 1.0, f) );
}

this.Script.InterpolBackgroundZ = function( MOB, src, dst, f) {
  return src + (dst - src) * MOB.Script.EasingFunctions.easeInOutQuad( Math.min( 1.0, f) );
}

this.Script.InterpolBackgroundY = function(MOB, src, dst, f) {
  var N = 14.1;
  var fff = MOB.Script.EasingFunctions.easeInOutQuad(Math.min(1.0, f));
  return Math.max(0.0,-(fff-0.5)*(fff-0.5)*N + N*0.25) + src;
}

this.Script.ChangeState = function( MOB, state, data ) {

  if (state == "ALFRENTE") {
    console.log("changed state to:", state);
    MOB.Script["status"] = "ALFRENTE";
    MOB.Script["ptimer"].Stop();
    MOB.Script["ptimer"].Start();
    MOB.Script["particle_selected_index"] = data.index;
    MOB.Script["particle_unselected_index"] = -1;

    console.log("Particle selected:", data);
    if (MOB.Script["dbready"] && data.pTextureMemory) {
      if (data.pTextureMemory.m_File) {
        var idc = data.pTextureMemory.m_File.m_FileName;
        var OBJ = MOB.Script["dbindex"][idc];
        console.log("DATA OBJ:", idc, OBJ);
        window["MoldeoJSView"].SetTitulo(OBJ.Titulo);
        window["MoldeoJSView"].SetDescripcion(OBJ.Descripcion);
        window["MoldeoJSView"].ShowOver();
      }
    }

    data["srcz"] = data.Pos3d.z;
    data["srcx"] = data.Pos3d.x;
    data["srcy"] = data.Pos3d.y;

    for (var k = 0; k < MOB.GetParticleCount(); k++) {
      if (data.index != undefined && k!=data.index ) {
        var dataA = MOB.GetParticle(k);
        dataA["dstx"] = dataA.Pos3d.x;
        dataA["dsty"] = dataA.Pos3d.y;
        dataA["dstz"] = -5;
        dataA["srcx"] = dataA.Pos3d.x;
        dataA["srcy"] = dataA.Pos3d.y;
        dataA["srcz"] = dataA.Pos3d.z;
      }
    }

    return true;
  }

  if (state == "ALFONDO") {
    console.log("changed state to:", state);
    MOB.Script["status"] = "ALFONDO";
    MOB.Script["ptimer"].Stop();
    MOB.Script["ptimer"].Start();
    MOB.Script["particle_selected_index"] = -1;
    MOB.Script["particle_unselected_index"] = data.index;
    window["MoldeoJSView"].HideOver();

    data["dstx"] = data["srcx"];
    data["dsty"] = data["srcy"];
    data["dstz"] = data["srcz"];

    data["srcx"] = data.Pos3d.x;
    data["srcy"] = data.Pos3d.y;
    data["srcz"] = data.Pos3d.z;

    for (var k = 0; k < MOB.GetParticleCount(); k++) {
      if (data.index!=undefined && k != data.index) {
        var dataA = MOB.GetParticle(k);
        dataA["srcx"] = dataA.Pos3d.x;
        dataA["srcy"] = dataA.Pos3d.y;
        dataA["srcz"] = dataA.Pos3d.z;
        dataA["dstx"] = dataA["srcx"];
        dataA["dsty"] = dataA["srcy"];
        dataA["dstz"] = 0;
      }
    }

    return true;
  }
  if (state) {
    console.error("Invalid state? [" + state + "] >> setting INVARIANT");
  }
  MOB.Script["status"] = "INVARIANT";
  return false;
}

this.Script.Init = function() {
  console.log("Init from script", this.m_pResourceManager);
}

this.Script.Status = function(MOB) {
  return MOB.Script["status"];
}

this.Script.ShowStatus = function(MOB) {
  //console.log("Script: Status >> [" + MOB.Script.Status(MOB)+"] State >> ("+MOB.Script.StateStatus(MOB)+")" );
}

this.Script.InvariantState = function(MOB) {

  if (window["Moldeo"]["db"] && MOB.Script["dbready"]==false) {
    MOB.Script["dbready"] = true;
    MOB.Script["dbindex"] = window["Moldeo"]["db"]["Index"];
    console.log("DATABASE READY:", window["Moldeo"]["db"]);
  }

  MOB.Script["maxage"] = MOB.m_Config.Eval("maxage");
  //console.log("Run from script", this.Script["maxage"]);
  MOB.Script["VPx"] = MOB.m_Config.Eval("eyex") + MOB.m_Config.Eval("viewx") - MOB.m_Config.Eval("translatex");
  MOB.Script["VPy"] = MOB.m_Config.Eval("eyex") + MOB.m_Config.Eval("viewy") - MOB.m_Config.Eval("translatey");
  MOB.Script["VPz"] = MOB.m_Config.Eval("eyez") + MOB.m_Config.Eval("viewz") - MOB.m_Config.Eval("translatez");

  if (MOB.Script["status"] == undefined) {
    MOB.Script["status"] = "INVARIANT";
  }
  MOB.Script.ShowStatus(MOB);
}

this.Script.Run = function() {
  this.Script.InvariantState(this);
}

this.Script.StateStatus = function( MOB, state ) {

  if ( (state && (MOB.Script["status"] == state && state=="ALFRENTE"))
  || (state==undefined &&  (MOB.Script["status"] == "ALFRENTE")) )  {
    if (MOB.Script["particle_selected_index"] > -1) {
      return 1;
    } else {
      return 0;
    }
  }

  if (state == "ALFONDO") {
    if (MOB.Script["particle_unselected_index"] > -1) {
      return 1;
    } else {
      return 0;
    }
  }

  return 0;
}

this.Script.RunParticle = function( i, dt ) {
    //console.log("RunParticle", i);
    var par = this.GetParticle(i);
    par["index"] = i;

    if (par.selected) {
      // esta particula fue tocada...
      console.log("particula tocada: ALFRENTE status? ", this.Script.StateStatus(this, "ALFRENTE"));
        if (this.Script.StateStatus(this,"ALFRENTE")==1) {
          //deselecciona la particula y la lleva al fondo
          var parSel = this.GetParticle(this.Script["particle_selected_index"]);
          this.Script.ChangeState(this,  "ALFONDO", parSel );
        } else if (this.Script.StateStatus(this, "ALFRENTE") == 0) {
          //selecciona la particula y la trae al frente
          this.Script.ChangeState(this, "ALFRENTE", par);
        }
        console.log("selected: ["+i+"]", this.Script["particle_selected_index"]);
      }

      if (this.Script.StateStatus(this, "ALFRENTE") == 1) {
          var fip = this.Script["ptimer"].Duration() / this.Script["ptimer_tofront"];
          if (fip >= 0.0) {
            if (this.Script["particle_selected_index"] == i) {
              par.Age.SetDuration(this.Script["maxage"]/2);
              //par.Size.x = 1.0;
              //par.Size.y = 1.0;
              par["dstx"] = this.Script["VPx"];
              par["dsty"] = this.Script["VPy"];
              par["dstz"] = this.Script["VPz"]+this.Script["zFront"];
              par.Pos3d.x = this.Script.Interpol( this, par["srcx"], par["dstx"], fip);
              par.Pos3d.y = this.Script.Interpol( this, par["srcy"], par["dsty"], fip);
              //console.log("ALFRENTE fip i[" + i + "] " + fip + " sel: " + this.Script["particle_selected_index"]);
              //console.log("par sel: par.Pos3d.z", par.Pos3d.z,
              //  "srcz: ", par["srcz"],
              //  "dstz: ", par["dstz"], " index:", par.index);
              par.Pos3d.z = this.Script.Interpol( this, par["srcz"], par["dstz"], fip);
              //console.log("particle captured modified!", par.Pos3d, par.Size);
            } else {
              //var fasefi = 800 / (800 + i * 2);
              var fasefi = Math.max(0.0, fip - 0.85*i/400.0 );
              par.Pos3d.y = this.Script.InterpolBackgroundY( this, par["srcy"], par["dsty"], fasefi );
              par.Pos3d.z = this.Script.InterpolBackgroundZ( this, par["srcz"], par["dstz"], fasefi);
            }

          }
      } else if (this.Script.StateStatus(this, "ALFONDO") == 1) {
        var fip = this.Script["ptimer"].Duration() / this.Script["ptimer_tofront"];
        if (fip <= 1.0) {
          //console.log("ALFONDO fip " + fip+" unsel: " + this.Script["particle_unselected_index"]);
        }
        if (fip <= 1.0) {
            if (this.Script["particle_unselected_index"] == i) {
              par.Age.SetDuration(this.Script["maxage"] / 2);
              par["srcx"] = this.Script["VPx"];
              par["srcy"] = this.Script["VPy"];
              par["srcz"] = this.Script["VPz"] + this.Script["zFront"];
              par.Pos3d.x = this.Script.Interpol(this, par["srcx"], par["dstx"], fip);
              par.Pos3d.y = this.Script.Interpol(this, par["srcy"], par["dsty"], fip);
              par.Pos3d.z = this.Script.Interpol(this, par["srcz"], par["dstz"], fip);
            } else {
              //var fasefi = Math.max(0.0, fip - (800+4*i)/800 );
              // 800 / (800 + i * 2)
              var fasefi = Math.max(0.0, fip - 0.85*i/400.0 );
              par.Pos3d.z = this.Script.InterpolBackgroundZ(this, par["srcz"], par["dstz"], fasefi);
            }
          }
      }

}

this.Script.Update = function() {
    if (this.mouse) {
        console.log("Update from script mouse:", this.mouse );
    }
}
