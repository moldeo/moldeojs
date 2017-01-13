var Translations = {
	"POSITION": "POSICION",
	"MOTION": "MOVIMIENTO",
	"SCALE": "ESCALA",
	"ABERRATION": "VELOCIDAD",
	"RANDOMMOTION": "DESCONTROLADO",
	"EMITTER": "EMISION",
	"BEHAVIOUR": "COMPORT.",
	"ATTRACTOR": "ATRACCION",
	
};

function TR( label ) {
	if (Translations[label]) return Translations[label];
	else return label;
}