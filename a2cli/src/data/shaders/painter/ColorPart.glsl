#extension GL_ARB_draw_buffers : enable

uniform sampler2D tex_unit_image;
uniform sampler2D tex_unit_newimage;
uniform sampler2D tex_unit_color;
uniform sampler2D tex_unit_coloraux;
uniform int brush_length;
uniform float newimage_coeff;
uniform float colorchg_frac;
uniform float colorchg_pow;

void main(void)
{
    vec2 image_coord = gl_TexCoord[0].st;
    vec2 part_coord = gl_TexCoord[2].st;

    vec3 image_color, final_color, newimage_color;
    float inv_nsteps, arg, frac, new_count, lim;

    bool color_chg = (0.0 <= newimage_coeff) && (newimage_coeff <= 1.0);

    vec4 prev_color = texture2D(tex_unit_color, part_coord);
    vec4 aux_data = texture2D(tex_unit_coloraux, part_coord);

    int max_count = int(float(brush_length) * aux_data.a);
    if (int(prev_color.a) < max_count)
    {
        // The particle keeps the previous color.
        gl_FragData[0] = vec4(prev_color.r, prev_color.g, prev_color.b, prev_color.a + 1.0);
        gl_FragData[1] = aux_data;
    }
    else
    {
        // Getting new color for the particle.
        if (int(prev_color.a) == max_count)
        {
            image_color = texture2D(tex_unit_image, image_coord).xyz;
        }
        else
        {
            // Using new color at the position where prev_color.a == max_count.
            image_color = aux_data.xyz;
        }

        if (color_chg)
        {
            newimage_color = texture2D(tex_unit_newimage, image_coord).xyz;
            image_color = (1.0 - newimage_coeff) * image_color + newimage_coeff * newimage_color;
        }

        // Evaluating final color...
        // Continuous transition between prev_color and image_color.
        new_count = 0.0;
        lim = (1.0 + colorchg_frac) * float(max_count);
        if ((0 < max_count) && (max_count <= int(prev_color.a)) && (prev_color.a <= lim))
        {
            inv_nsteps = 1.0 / (colorchg_frac * float(max_count));
            arg = inv_nsteps * (prev_color.a - float(max_count));
            frac = pow(arg, colorchg_pow);

            // Without this useless code it doesn't work on ATI (tested on X1600, both PC and Mac).
            if (frac < 0.5) final_color = vec3(1.0, 0.0, 0.0);
            else final_color = vec3(0.0, 1.0, 0.0);
            // ...useless code ends here.

            final_color = (1.0 - frac) * prev_color.xyz +  frac * image_color;
            new_count = prev_color.a + 1.0;
        }
        else final_color = image_color;

        gl_FragData[0] = vec4(final_color, new_count);
        gl_FragData[1] = vec4(image_color, aux_data.a);
    }
}
