#define KERNEL_SIZE 9

// Edge detection kernel
// -1 -1 -1
// -1 +8 -1
// -1 -1 -1
float kernel[KERNEL_SIZE];

uniform sampler2D src_tex_unit0;
uniform sampler2D src_tex_unit1;
uniform vec2 src_tex_offset0;
uniform vec2 src_tex_offset1;
uniform vec2 tempo_angle;

const vec3 coef= vec3(0.2125, 0.7154, 0.0721);

vec2 offset[KERNEL_SIZE];

void main(void)
{
    vec2 coord0 = gl_TexCoord[0].st;
    vec2 coord1 = gl_TexCoord[1].st;
	
	coord0.t = 1 - coord0.t;

	float src_intensity;
	float act_intensity;

	vec4 act_color = texture2D(src_tex_unit1, coord1);
	vec4 src_color = texture2D(src_tex_unit0, coord0);	
	
	//Edges....
	/*
    int i = 0;
    vec4 sum = vec4(0.0);

    offset[0] = vec2(-src_tex_offset1.s, -src_tex_offset1.t);
    offset[1] = vec2(0.0, -src_tex_offset1.t);
    offset[2] = vec2(src_tex_offset1.s, -src_tex_offset1.t);

    offset[3] = vec2(-src_tex_offset1.s, 0.0);
    offset[4] = vec2(0.0, 0.0);
    offset[5] = vec2(src_tex_offset1.s, 0.0);

    offset[6] = vec2(-src_tex_offset1.s, src_tex_offset1.t);
    offset[7] = vec2(0.0, src_tex_offset1.t);
    offset[8] = vec2(src_tex_offset1.s, src_tex_offset1.t);

    kernel[0] = -1.0;   kernel[1] = -1.0;   kernel[2] = -1.0;
    kernel[3] = -1.0;   kernel[4] = 8.0;    kernel[5] = -1.0;
    kernel[6] = -1.0;   kernel[7] = -1.0;   kernel[8] = -1.0;

    for(i = 0; i < KERNEL_SIZE; i++)
    {
        vec4 tmp = texture2D(src_tex_unit1, gl_TexCoord[1].st + offset[i]);
        sum += tmp * kernel[i];
    }
	
	act_color.rgb = sum.rgb;
	*/
	
	src_intensity = dot(src_color.rgb,coef);
	act_intensity = dot(act_color.rgb,coef);
	
	if (act_intensity>src_intensity) {
		gl_FragColor = vec4( act_color.rgb, 1.0);
	} else gl_FragColor = vec4( src_color.rgb, 1.0);    
}
