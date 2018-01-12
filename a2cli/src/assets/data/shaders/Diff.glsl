uniform sampler2D src_tex_unit0;
uniform sampler2D src_tex_unit1;
uniform vec2 src_tex_offset0;
uniform vec2 src_tex_offset1;
uniform vec2 tempo_angle;
uniform vec2 dest_tex_size;

void main(void)
{

	vec4 color0 = texture2D(src_tex_unit0, gl_TexCoord[0].st);
	vec4 color1 = texture2D(src_tex_unit1, gl_TexCoord[0].st);
	vec4 diffcolor = vec4( abs( color1.r - color0.r ), abs( color1.g - color0.g ), abs( color1.b - color0.b ), 1.0 );
	
	vec3 lumv = vec3 ( 0.30, 0.59, 0.11 );
	vec3 lumcolor = vec3( diffcolor.rgb );
	
	float intens = dot( lumcolor, lumv );

	
	if (intens>0.25) {
		intens = 1.0;
	} else {
		intens = 0.0;
	}
	
	
    //gl_FragColor = vec4( intens, intens, intens, intens );
	gl_FragColor = vec4( intens, intens, intens, intens  );
	//gl_FragColor = diffcolor;
}
