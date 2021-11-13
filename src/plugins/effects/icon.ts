import * as MO from "moldeojs";
import { moVector2 } from 'moldeojs';

export enum moIconParamIndex {
  ICON_INLET=0,
  ICON_OUTLET,
  ICON_SCRIPT,
	ICON_ALPHA,
	ICON_COLOR,
	ICON_SYNC,
	ICON_PHASE,

  ICON_TEXTURE,
  ICON_BLENDING,
  ICON_WIDTH,
  ICON_HEIGHT,
  ICON_TRANSLATEX,
  ICON_TRANSLATEY,
  ICON_ROTATE,
  ICON_SCALEX,
  ICON_SCALEY

};


export class moEffectIcon extends MO.moEffect {

  RM: MO.moRenderManager;
  GL: MO.moGLManager;

  Plane: MO.moPlaneGeometry;
  /*Mat: MO.moMaterialBasic;*/
  Mat : any;
  Camera: MO.moCamera3D;
  Model: MO.moGLMatrixf;
  Mesh: MO.moMesh;
  Scene: MO.moSceneNode;

  constructor() {
    super();
    this.SetName("icon");
  }

  Init(callback?:any): boolean {
    this.RM = this.m_pResourceManager.GetRenderMan();
    this.GL = this.m_pResourceManager.GetGLMan();

    console.log(`moEffect${this.GetName()}.Init ${this.GetName()}`);
    if (this.PreInit((res) => {
      if (callback) callback(res);
    }) == false) {
      return false;
    }
    return true;
  }

  Draw( p_tempo : MO.moTempo, p_parentstate : MO.moEffectState = null ) : void {
    this.BeginDraw(p_tempo, p_parentstate);


    if (this.RM == undefined) return;

    var rgb: any = this.m_Config.EvalColor("color");
    var ccolor: MO.moColor = new MO.moColor( rgb.r, rgb.g, rgb.b);

    var useshader : boolean = true;
    var interpolation : Number = this.m_Config.Eval("interpolation");
    //tempo
    //var tempo_angle : MO.moVector2;
    var tempo_angle : any = new this.THREE.Vector2( p_tempo.ang, 0.0);
    //console.log(tempo_angle.x);
    //tempo_angle.x = p_tempo.ang;
    //tempo_angle.y = 0.0;
    //float a = p_tempo->ang;
    //float f = fmod(float(a), float(2.0 * moMathf::PI)) / (2.0 * moMathf::PI);

    ///MESH MATERIAL
    if (this.Mat==undefined) {
      if (useshader) {
        let uniforms = {
            color: {
                type: 'vec3',
                value: new this.THREE.Color(rgb.r, rgb.g, rgb.b)
              },
            src_tex_unit0: {
              type: 'sampler2D',
              value: this.m_Config.Texture("texture")._texture
            },
            src_tex_offset0: {
              type: 'vec2',
              value: new this.THREE.Vector2( 1.0/this.m_Config.Texture("texture").GetWidth(), 1.0/this.m_Config.Texture("texture").GetHeight() )
            },
            texres: {
              type: 'vec2',
              value: new this.THREE.Vector2(this.m_Config.Texture("texture").GetWidth(), this.m_Config.Texture("texture").GetHeight() )
            },
            interpolation: {
              type: 'float',
              value: '0.5'
            },
            tempo_angle: {
              type: 'vec2',
              value: new this.THREE.Vector2(tempo_angle.x,tempo_angle.y)
            }
        }
        console.log("Icon.ts Uniforms/...",uniforms);
        this.Mat =  new this.THREE.ShaderMaterial({
                            uniforms: uniforms,
                            vertexShader: `
                        varying vec2 vUv;

                        void main() {
                          vUv = position.xy;

                          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                          gl_Position = projectionMatrix * modelViewPosition;
                        }
                      `,
                      fragmentShader: `

                            uniform sampler2D src_tex_unit0;
                            uniform vec2 src_tex_offset0;
                            uniform vec3 color;
                            uniform vec2 texres;
                            varying vec2 vUv;

                            uniform vec2 tempo_angle;
                            uniform float interpolation;

                            #define KERNEL_SIZE 9

                            // Gaussian kernel
                            // 1 2 1
                            // 2 4 2
                            // 1 2 1
                            float kernel[KERNEL_SIZE];
                            vec2 offset[KERNEL_SIZE];

                            vec3 mod289(vec3 x) {
                              return x - floor(x * (1.0 / 289.0)) * 289.0;
                            }

                            vec2 mod289(vec2 x) {
                              return x - floor(x * (1.0 / 289.0)) * 289.0;
                            }

                            vec3 permute(vec3 x) {
                              return mod289(((x*34.0)+1.0)*x);
                            }

                            float snoise(vec2 v)
                              {
                              const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                                                  0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                                                 -0.577350269189626,  // -1.0 + 2.0 * C.x
                                                  0.024390243902439); // 1.0 / 41.0
                            // First corner
                              vec2 i  = floor(v + dot(v, C.yy) );
                              vec2 x0 = v -   i + dot(i, C.xx);

                            // Other corners
                              vec2 i1;
                              //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
                              //i1.y = 1.0 - i1.x;
                              i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                              // x0 = x0 - 0.0 + 0.0 * C.xx ;
                              // x1 = x0 - i1 + 1.0 * C.xx ;
                              // x2 = x0 - 1.0 + 2.0 * C.xx ;
                              vec4 x12 = x0.xyxy + C.xxzz;
                              x12.xy -= i1;

                            // Permutations
                              i = mod289(i); // Avoid truncation effects in permutation
                              vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
                            		+ i.x + vec3(0.0, i1.x, 1.0 ));

                              vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                              m = m*m ;
                              m = m*m ;

                            // Gradients: 41 points uniformly over a line, mapped onto a diamond.
                            // The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

                              vec3 x = 2.0 * fract(p * C.www) - 1.0;
                              vec3 h = abs(x) - 0.5;
                              vec3 ox = floor(x + 0.5);
                              vec3 a0 = x - ox;

                            // Normalise gradients implicitly by scaling m
                            // Approximation of: m *= inversesqrt( a0*a0 + h*h );
                              m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

                            // Compute final noise value at P
                              vec3 g;
                              g.x  = a0.x  * x0.x  + h.x  * x0.y;
                              g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                              return 130.0 * dot(m, g);
                            }

                            float rand(vec2 co)
                              {
                                 return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
                              }



                          void main() {

                            //vec4 sum = vec4(0.0);
                            float sum = 0.0;

                            vec2 toff = vec2( 1.0/texres.x, 1.0/texres.y );
                            vec2 tdisp = vec2( -0.0, 0.0 );
                            vec2 tscale = vec2( 0.25, 0.25 );

                            vec2 tfinal = 1.0 * vec2(
                                                    tscale.x * ( vUv.x*1.0 + 1.75) ,
                                                    tscale.y * ( vUv.y*1.0 + 1.75)
                                                  ) + tdisp;

                            //tfinal = vec2( vUv.x, vUv.y );
                            toff = 1.0 * vec2(
                                                    tscale.x * ( toff.x*1.0) ,
                                                    tscale.y * ( toff.y*1.0)
                                                  );

                            // Create large, incidental noise waves
                            float time = tempo_angle.x;
                            vec2 uv = tfinal;
                            vec2 fragCoord = vUv;

                            float noise = max(0.0, snoise(vec2(time, uv.y * 0.3)) - 0.3) * (1.0 / 0.7);

                            // Offset by smaller, constant noise waves
                            noise = noise + (snoise(vec2(time*10.0, uv.y * 2.4)) - 0.5) * 0.15;

                            // Apply the noise as x displacement for every line
                            float xpos = uv.x - noise * noise * 0.25;
                            vec4 fragColor = texture2D(src_tex_unit0, vec2(xpos, uv.y));


                            // Mix in some random interference for lines
                            fragColor.rgb = mix(fragColor.rgb, vec3(rand(vec2(uv.y * time))), noise * 0.3).rgb;

                            // Apply a line pattern every 4 pixels
                            if (floor(mod(fragCoord.y * 0.25, 2.0)) == 0.0)
                            {
                                fragColor.rgb *= 1.0 - (0.15 * noise);
                            }

                            fragColor.r = mix(fragColor.r, texture2D(src_tex_unit0, vec2(xpos + noise * 0.07, uv.y)).r, 0.25);
                            fragColor.g = mix(fragColor.r, texture2D(src_tex_unit0, vec2(xpos + noise * 0.05, uv.y)).g, 0.25);
                            fragColor.b = mix(fragColor.r, texture2D(src_tex_unit0, vec2(xpos - noise * 0.05, uv.y)).b, 0.25);

                            vec2 UVNoise = vec2(xpos + noise * 0.07, uv.y);
                            tfinal.x = UVNoise.x;
                            tfinal.y = UVNoise.y;




                            offset[0] = vec2(-toff.x, -toff.y);
                            offset[1] = vec2(0.0, -toff.y);
                            offset[2] = vec2(toff.x, -toff.y);

                            offset[3] = vec2(-toff.x, 0.0);
                            offset[4] = vec2(0.0, 0.0);
                            offset[5] = vec2(toff.x, 0.0);

                            offset[6] = vec2(-toff.x, toff.y);
                            offset[7] = vec2(0.0, toff.y);
                            offset[8] = vec2(toff.x, toff.y);

                            kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;
                            kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;
                            kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;

                            for(int i = 0; i < 4; i++)
                            {
                                //vec4 tmp = texture2D(src_tex_unit0, tfinal + offset[i]);
                                float tmp = texture2D(src_tex_unit0, tfinal + offset[i]).w;
                                sum += tmp * tmp * kernel[i];
                            }

                            for(int i = 5; i < KERNEL_SIZE; i++)
                            {
                                //vec4 tmp = texture2D(src_tex_unit0, tfinal + offset[i]);
                                float tmp = texture2D(src_tex_unit0, tfinal + offset[i]).w;
                                sum += tmp * tmp * kernel[i];
                            }
                            //vec4 color0 = texture2D(src_tex_unit0, tfinal + offset[4]);
                            float color0 = texture2D(src_tex_unit0, tfinal + offset[4]).w;
                              sum += color0 * color0 * kernel[4];



                            //float alphafinal;
                            //vec4 src_color = texture2D( src_tex_unit0, tfinal );

                            //gl_FragColor = vec4( tfinal.x, tfinal.y, 0.0, 1.0-sum*sum );
                            //gl_FragColor = vec4( tfinal.x, fragColor.g, fragColor.b, 1.0-sum*sum );

                            //gl_FragColor = vec4( fragColor.r, fragColor.g, fragColor.b, sum*sum*sum*sum );

                            gl_FragColor = vec4( fragColor.r, fragColor.g, fragColor.b, sum*sum*sum*sum );

                            //gl_FragColor = vec4(vUv.x,vUv.y,0.0,1.0);
                            //gl_FragColor = vec4( src_color.xyz, src_color.w*(0.5+tempo_angle.x/5.0) );
                          }
                      `,
                      /*side: this.THREE.DoubleSide,*/
                      /*blending: this.THREE.AdditiveBlending,*/
                      /*transparent: true,*/
                      /*depthWrite: false*/

                    });
      } else {
          this.Mat = new MO.moMaterialBasic();
      }

    }
    if (this.Mat) {

      /*let geometry = new THREE.BoxGeometry(1, 1, 1);*/
      if (useshader) {
        /*uniforms = {
            colorB: {type: 'vec3', value: new this.THREE.Color(0xACB6E5)},
            colorA: {type: 'vec3', value: new this.THREE.Color(0x74ebd5)},
            texture1: { type: "t", value: this.m_Config.Texture("texture")._texture }
        }*/
        //this.m_Config.Texture("texture")._texture.minFilter = this.THREE.LinearFilter;
        this.Mat.uniforms.color.value = new this.THREE.Color(rgb.r, rgb.g, rgb.b);
        this.Mat.uniforms.src_tex_unit0.value = this.m_Config.Texture("texture")._texture;
        this.Mat.uniforms.texres.value = new this.THREE.Vector2( this.m_Config.Texture("texture").GetWidth(), this.m_Config.Texture("texture").GetHeight() );
        this.Mat.uniforms.tempo_angle.value = new this.THREE.Vector2(tempo_angle.x,tempo_angle.y);

        //this.Mat.
      } else {
        this.Mat.map = this.m_Config.Texture("texture")._texture;
        this.Mat.transparent = true;
        this.Mat.color = ccolor;
      }


      this.Mat.opacity = this.m_Config.Eval("alpha");
    }

    //Mat2.m_MapGLId = Mat2.m_Map->GetGLId();
    //Mat2.m_Color = moColor(1.0, 1.0, 1.0);
    //Mat2.m_vLight = moVector3f( -1.0, -1.0, -1.0 );
    //Mat2.m_vLight.Normalize();

    ///MESH GEOMETRY
    if (this.Plane == undefined) {
      this.Plane = new MO.moPlaneGeometry(
        this.m_Config.Eval("width"),
        this.m_Config.Eval("height"),
        1, 1);
    }

    if (this.Plane) {
      if (this.Plane.m_Width != this.m_Config.Eval("width")
        || this.Plane.m_Height != this.m_Config.Eval("height")) {
        Object.assign(this.Plane, new MO.moPlaneGeometry( this.m_Config.Eval("width"),
                                                          this.m_Config.Eval("height"),
                                                          1, 1));
      }
    }

    ///MESH MODEL
    if (this.Model==undefined)
      this.Model = new MO.moGLMatrixf().MakeIdentity();

    if (this.Model) {


      this.Model.Scale(
        this.m_Config.Eval("scalex"),
        this.m_Config.Eval("scaley"),
      1.0);

      this.Model.Rotate(
          -this.m_Config.Eval("rotate")*MO.moMath.DEG_TO_RAD,
          0.0,
          0.0,
          1.0);
      //console.log("this.m_Config.Eval(anc_cuad_x)",
      //  this.m_Config.Eval("anc_cuad_x"),
      //  this.m_Config.Eval("alt_cuad_y"));
      this.Model.Translate(
          this.m_Config.Eval("translatex"),
          this.m_Config.Eval("translatey"),
          0.0);

    }

    if (this.Mesh==undefined) {
      this.Mesh = new MO.moMesh( this.Plane, this.Mat );
    }
    if (this.Mesh && this.Model) {
      this.Mesh.SetModelMatrix(this.Model);
    }

    if (this.Scene==undefined) {
      this.Scene = new MO.moSceneNode();
      this.Scene.add(this.Mesh);
    }


    ///CAMERA PERSPECTIVE
    if (this.Camera==undefined)
      this.Camera = new MO.moCamera3D();
    var rs: MO.moVector2 = new MO.moVector2();
    this.RM.m_Renderer.getSize(rs);
    this.GL.SetDefaultOrthographicView(
        rs.width,
        rs.height);
    this.Camera.projectionMatrix = this.GL.GetProjectionMatrix();

    ///RENDERING
    this.RM.Render( this.Scene, this.Camera);
    //console.log("moEffectImage.Draw", this.Scene, this.Camera, this.Mat.map );


    //this.RM.m_Renderer.setClearColor( ccolor, 1.0);
    //this.RM.m_Renderer.clear(true, true, false);

    this.EndDraw();

  }

  Update( p_Event: MO.moEventList ) : void {
    super.Update(p_Event);
    //console.log("moEffectIcon.Update");
  }

  GetDefinition(p_configdefinition?: MO.moConfigDefinition): MO.moConfigDefinition {

    p_configdefinition = super.GetDefinition(p_configdefinition);

    p_configdefinition.Add( "texture", MO.moParamType.MO_PARAM_TEXTURE, moIconParamIndex.ICON_TEXTURE, new MO.moValue( "default", "TXT" ) );
    p_configdefinition.Add( "blending", MO.moParamType.MO_PARAM_BLENDING, moIconParamIndex.ICON_BLENDING, new MO.moValue( "0", "NUM" ) );
    p_configdefinition.Add( "width", MO.moParamType.MO_PARAM_FUNCTION, moIconParamIndex.ICON_WIDTH, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "height", MO.moParamType.MO_PARAM_FUNCTION, moIconParamIndex.ICON_HEIGHT, new MO.moValue( "1.0", "FUNCTION" ) );
    p_configdefinition.Add( "translatex", MO.moParamType.MO_PARAM_TRANSLATEX, moIconParamIndex.ICON_TRANSLATEX, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "translatey", MO.moParamType.MO_PARAM_TRANSLATEY, moIconParamIndex.ICON_TRANSLATEY, new MO.moValue( "0.0", "FUNCTION" ) );
    p_configdefinition.Add( "rotate", MO.moParamType.MO_PARAM_ROTATEZ, moIconParamIndex.ICON_ROTATE );
    p_configdefinition.Add( "scalex", MO.moParamType.MO_PARAM_SCALEX, moIconParamIndex.ICON_SCALEX );
    p_configdefinition.Add( "scaley", MO.moParamType.MO_PARAM_SCALEY, moIconParamIndex.ICON_SCALEY );
    //console.log("moEffectIcon.GetDefinition Erase",p_configdefinition);

    return this.m_Config.GetConfigDefinition();
  }

}
