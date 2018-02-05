// Emboss kernel
// +2  0  0
//  0 -1  0
//  0  0 -1


uniform sampler2D src_tex_unit0;
uniform vec2 tempo_angle;
uniform float fade_const;


void main()
{
   const float offset = 1.0 / 512.0;
  
   vec2 texCoord = gl_TexCoord[0].xy;
 
   vec4 color0  = texture2D(src_tex_unit0, texCoord);
   
   vec4 tl = texture2D(src_tex_unit0, texCoord + vec2(-offset,  offset));
   vec4 br = texture2D(src_tex_unit0, texCoord + vec2( offset,  offset));
   
   vec4 sum=(2.0*tl-color0-br);
   float luminance = clamp(0.299 * sum.r + 0.587 * sum.g + 0.114 * sum.b,0.0,1.0);
   sum = vec4( luminance,luminance,luminance,1.0 );

   gl_FragColor = (1.0 - fade_const) * color0 + fade_const * sum ;	
	
}