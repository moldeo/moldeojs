uniform sampler2D tex_unit_pos;
uniform sampler2D tex_unit_grad;
uniform sampler2D tex_unit_vel;
uniform vec2 max_pos;
uniform float vel_mean;
uniform int follow_grad;
uniform float noise_mag;

void main(void)
{
    vec2 tex_coord = gl_TexCoord[0].st;
    vec2 noise = gl_TexCoord[1].st;

    // Updating particle position.
    vec2 old_pos = texture2D(tex_unit_pos, tex_coord).xy;
    vec2 new_pos;

    if (bool(follow_grad))
    {
        vec2 velocity = texture2D(tex_unit_grad, vec2(old_pos.x / max_pos.x, old_pos.y / max_pos.y)).xy;
        float vcoeff = texture2D(tex_unit_vel, tex_coord).x;
        new_pos = old_pos + vcoeff * vel_mean * velocity;
    }
    else new_pos = old_pos;

    new_pos += noise_mag * noise;

    // Wrapping position around the edges...
    float v, f, maxv, fracf;
    int intf;

    v = new_pos.x;
    maxv = max_pos.x;
    f = v / maxv;
    intf = int(f);
    fracf = f - float(intf);
    if (f < 0.0) new_pos.x = (1.0 + fracf) * maxv;
    else if (1.0 < f) new_pos.x = fracf * maxv;
    else new_pos.x = v;

    v = new_pos.y;
    maxv = max_pos.y;
    f = v / maxv;
    intf = int(f);
    fracf = f - float(intf);
    if (f < 0.0) new_pos.y = (1.0 + fracf) * maxv;
    else if (1.0 < f) new_pos.y = fracf * maxv;
    else new_pos.y = v;

    gl_FragColor = vec4(new_pos, 0.0, 1.0);
}
