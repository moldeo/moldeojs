#define KERNEL_SIZE 9

vec2 kernel[KERNEL_SIZE];

uniform sampler2D tex_unit_image;
uniform sampler2D tex_unit_random;
uniform vec2 tex_scale;

vec2 offset[KERNEL_SIZE];

vec3 lum_coeff;

void main(void)
{
    float luminance;
    vec3 color;
    vec2 grad_sum;

    kernel[0] = vec2(-1.0, +1.0);   kernel[1] = vec2(0.0, +2.0);    kernel[2] = vec2(+1.0, +1.0);
    kernel[3] = vec2(-2.0,  0.0);   kernel[4] = vec2(0.0,  0.0);    kernel[5] = vec2(+2.0,  0.0);
    kernel[6] = vec2(-1.0, -1.0);   kernel[7] = vec2(0.0, -2.0);    kernel[8] = vec2(+1.0, -1.0);

    lum_coeff = vec3(0.299, 0.587, 0.114);

    offset[0] = vec2(-tex_scale.s, -tex_scale.t); offset[1] = vec2(-tex_scale.s, 0.0); offset[2] = vec2(-tex_scale.s, tex_scale.t);
    offset[3] = vec2(0.0, -tex_scale.t);          offset[4] = vec2(0.0, 0.0);          offset[5] = vec2(0.0, tex_scale.t);
    offset[6] = vec2(tex_scale.s, -tex_scale.t);  offset[7] = vec2(tex_scale.s, 0.0);  offset[8] = vec2(tex_scale.s, tex_scale.t);

    // Calculating gradient of the luminance at point (coord0.s, coord0.t) of the image.
    grad_sum = vec2(0.0, 0.0);
    for (int k = 0; k < KERNEL_SIZE; k++)
    {
        color = texture2D(tex_unit_image, gl_TexCoord[0].st + offset[k]).rgb;
        luminance = dot(lum_coeff, color);
        grad_sum += luminance * kernel[k];
    }

    // Normalizing the gradient.
    float grad_norm = sqrt(grad_sum.x * grad_sum.x + grad_sum.y * grad_sum.y);
    if (0.0 < grad_norm) grad_sum /= grad_norm;
    else grad_sum = texture2D(tex_unit_random, gl_TexCoord[1].st).xy;

    gl_FragColor = vec4(grad_sum.xy, 0.0, 1.0);
}
