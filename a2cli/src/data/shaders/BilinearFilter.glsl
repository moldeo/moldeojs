uniform sampler2D src_tex_unit0;
uniform vec2 src_tex_offset0;

vec4 texture2D_bilinear(sampler2D tex, vec2 uv)
{
    vec2 f;

    f.x = fract(uv.x / src_tex_offset0.x);
    f.y = fract(uv.y / src_tex_offset0.y);

    vec4 t00 = texture2D(tex, uv + vec2(0.0, 0.0));
    vec4 t10 = texture2D(tex, uv + vec2(src_tex_offset0.x, 0.0));
    vec4 tA = mix(t00, t10, f.x);

    vec4 t01 = texture2D( tex, uv + vec2( 0.0, src_tex_offset0.y));
    vec4 t11 = texture2D( tex, uv + vec2(src_tex_offset0.x, src_tex_offset0.y));
    vec4 tB = mix( t01, t11, f.x );

    return mix(tA, tB, f.y);
}

void main(void)
{
    gl_FragColor = texture2D_bilinear(src_tex_unit0, gl_TexCoord[0].st);
}
