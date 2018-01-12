// Emboss kernel
// +2  0  0
//  0 -1  0
//  0  0 -1


uniform sampler2D src_tex_unit0;
uniform vec2 tempo_angle;
uniform float fade_const;


void main()
{
   const float offset = 1.0 / 256.0;
  
   vec2 texCoord = gl_TexCoord[0].xy;
 
   vec4 color0  = texture2D(src_tex_unit0, texCoord);
   
   vec4 tl = texture2D(src_tex_unit0, texCoord + vec2( -offset,  offset));
   vec4 br = texture2D(src_tex_unit0, texCoord + vec2( offset,  -offset));
   
   vec4 tl2 = texture2D(src_tex_unit0, texCoord + vec2( offset,  -offset));
   vec4 br2 = texture2D(src_tex_unit0, texCoord + vec2( -offset,  offset));
   
   vec4 sum = (1.8*tl-color0-br);
   vec4 sum2 =(2.7*tl2-color0-br2) ;   
   
   float luminance = clamp(0.299 * sum.r + 0.587 * sum.g + 0.114 * sum.b,0.0,1.0);
   float luminance2 = clamp(0.299 * sum2.r + 0.587 * sum2.g + 0.114 * sum2.b,0.0,1.0);
   
   float greyvalue = clamp( (1.0*gl_TexCoord[0].x-1.0*gl_TexCoord[0].y)/2.39+0.34,0.0,1.0);
   float greyvalue2 = clamp( (1.0*gl_TexCoord[0].x-1.0*gl_TexCoord[0].y)/2.39+0.34,0.0,1.0);
   
   vec4 vdegrade = vec4(greyvalue, greyvalue, greyvalue, 0.0 );
   vec4 vdegrade2 =  vec4( greyvalue2,  greyvalue2, greyvalue2, 0.0 );
   
   sum = vdegrade + vec4( luminance,luminance,luminance,1.0 );
  sum2 = vdegrade2 + vec4( luminance2,luminance2,luminance2,0.0 );
  
  if ( luminance > 0.9 ) {
  	sum = sum;
  } else {
  	sum = vec4( 1.0,1.0,1.0,1.0) - sum2;  
  }

   gl_FragColor = (1.0 - fade_const) * color0 + fade_const * sum ;	
	
}