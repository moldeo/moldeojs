#define KERNEL_SIZE 9

// Sobel detection kernel
//  1  2  1
//  0  0  0 
// -1 -2 -1

// -1  0  1
// -2  0  2 
// -1  0  1

float kernel[KERNEL_SIZE];
float kernel2[KERNEL_SIZE];

uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;

uniform vec2 tempo_angle;

uniform float fade_const;

vec2 offset[KERNEL_SIZE];

//SOBEL
float Brightness;

void main(void)
{
    int i = 0;
    float sum = 0.0;
    float sum2 = 0.0;
    vec4 result = vec4(0.0);
    vec4 lumv = vec4 ( 0.30, 0.59, 0.11, 1.0 );
    
    //src_tex_offset0 = vec2( 0.015,0.015);

    offset[0] = vec2(-src_tex_offset0.s, -src_tex_offset0.t);
    offset[1] = vec2(0.0, -src_tex_offset0.t);
    offset[2] = vec2(src_tex_offset0.s, -src_tex_offset0.t);

    offset[3] = vec2(-src_tex_offset0.s, 0.0);
    offset[4] = vec2(0.0, 0.0);
    offset[5] = vec2(src_tex_offset0.s, 0.0);

    offset[6] = vec2(-src_tex_offset0.s, src_tex_offset0.t);
    offset[7] = vec2(0.0, src_tex_offset0.t);
    offset[8] = vec2(src_tex_offset0.s, src_tex_offset0.t);

    kernel[0] = -1.0;   kernel[1] = 0.0;   kernel[2] = 1.0;
    kernel[3] = -2.0;   kernel[4] = 0.0;    kernel[5] = 2.0;
    kernel[6] = -1.0;   kernel[7] = 0.0;   kernel[8] = 1.0;

    kernel2[0] = 1.0;   kernel2[1] = 2.0;   kernel2[2] = 1.0;
    kernel2[3] = 0.0;   kernel2[4] = 0.0;   kernel2[5] = 0.0;
    kernel2[6] = -1.0;   kernel2[7] = -2.0;   kernel2[8] = -1.0;
    
    for (i = 0; i < 4; i++)
    {
        vec4 tmp = texture2D(src_tex_unit0, gl_TexCoord[0].st + offset[i]);
        sum += dot(tmp,lumv) * kernel[i];
		sum2 += dot(tmp,lumv) * kernel2[i];
    }

    for (i = 5; i < KERNEL_SIZE; i++)
    {
        vec4 tmp = texture2D(src_tex_unit0, gl_TexCoord[0].st + offset[i]);
        sum += dot(tmp,lumv) * kernel[i];
	    sum2 += dot(tmp,lumv) * kernel2[i];
    }
	
    vec4 color0 = texture2D(src_tex_unit0, gl_TexCoord[0].st + offset[4]);

	
    sum += dot(color0,lumv) * kernel[4];
    sum2 += dot(color0,lumv) * kernel2[4];
    
    float edge1 = sqrt( sum*sum + sum2*sum2 );
    float edge2 = ( edge1 > 0.1 ) ? 1.0 : 0.0 ;
   
   	float l = dot(color0,lumv);

    gl_FragColor = (1.0 - fade_const) * color0 +  fade_const * edge1 * edge2  *  vec4( l,l,l , 1.0  );
    
}


