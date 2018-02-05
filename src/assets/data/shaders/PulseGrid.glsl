#define PI 3.141592653589793

uniform vec2 tempo_angle;
uniform vec2 dest_tex_size;
uniform float fade_const;

void main(void)
{
    vec4 newVertexPos;

    gl_TexCoord[0].xy = gl_MultiTexCoord0.xy;
	
	vec2 f = vec2(0.0, 0.0);
	vec2 d = gl_Vertex.xy - vec2(0.5 * dest_tex_size.x, 0.5 * dest_tex_size.y);
	float n = sqrt(d.x * d.x + d.y * d.y);
	if (0.0 < n)
	{
		f.x = cos(2.0 * PI * tempo_angle.y) * d.x / n;
		f.y = sin(2.0 * PI * tempo_angle.y) * d.y / n;
	}
	
    vec4 v = vec4(20.0 * f.x, 20.0 * f.y, 0.0, 0.0);
    newVertexPos = gl_Vertex + fade_const * v;
	
    gl_Position = gl_ModelViewProjectionMatrix * newVertexPos;
}
