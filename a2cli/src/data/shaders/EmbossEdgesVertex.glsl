uniform vec2 tempo_angle;

void main()
{
	gl_TexCoord[0] = gl_MultiTexCoord0;
	//gl_Vertex.x = gl_Vertex.x*(1.0+cos(tempo_angle));
	gl_Position = ftransform();
} 
