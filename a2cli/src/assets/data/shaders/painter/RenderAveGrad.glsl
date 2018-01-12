#extension GL_ARB_draw_buffers : enable

uniform sampler2D tex_unit_grad;
uniform sampler2D tex_unit_random;
uniform sampler2D tex_unit_newgrad;
uniform vec2 tex_scale;
uniform float newgrad_coeff;

void main(void)
{
    vec2 grad, newgrad, grad_sum, newgrad_sum, coord;
    float grad_length;

    vec2 coord0 = gl_TexCoord[0].st;

    grad_sum = vec2(0.0, 0.0);
    for (int i = -1; i <= +1; i++)
        for (int j = -1; j <= +1; j++)
        {
            coord = coord0 + vec2(tex_scale.s * float(i), tex_scale.t * float(j));
            grad = texture2D(tex_unit_grad, coord).xy;
            grad_sum += grad;
        }
    grad_sum /= 9.0;
    // Normalizing the gradient.
    grad_length = length(grad_sum);
    if (0.0 < grad_length) grad_sum /= grad_length;
    else grad_sum = texture2D(tex_unit_random, coord0).xy;

    if ((0.0 <= newgrad_coeff) && (newgrad_coeff <= 1.0))
    {
        // Averaging new gradient.
        newgrad_sum = vec2(0.0, 0.0);
        for (int i = -1; i <= +1; i++)
            for (int j = -1; j <= +1; j++)
            {
                coord = coord0 + vec2(tex_scale.s * float(i), tex_scale.t * float(j));
                newgrad = texture2D(tex_unit_newgrad, coord).xy;
                newgrad_sum += newgrad;
            }
        newgrad_sum /= 9.0;
        // Normalizing the gradient.
        grad_length = length(newgrad_sum);
        if (0.0 < grad_length) newgrad_sum /= grad_length;
        else newgrad_sum = texture2D(tex_unit_random, coord0).xy;

        // Calculating linear combination of old and new gradients.
        vec2 lc_grad = (1.0 - newgrad_coeff) * grad_sum + newgrad_coeff * newgrad_sum;
        grad_length = length(lc_grad);
        if (0.0 < grad_length) lc_grad /= grad_length;
        else lc_grad = texture2D(tex_unit_random, coord0).xy;

        gl_FragData[0] = vec4(lc_grad.x, lc_grad.y, 0.0, 1.0);
        gl_FragData[1] = vec4(newgrad_sum.x, newgrad_sum.y, 0.0, 1.0);
    }
    else
        gl_FragData[0] = vec4(grad_sum.x, grad_sum.y, 0.0, 1.0);
}
