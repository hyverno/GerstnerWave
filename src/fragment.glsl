precision mediump float;
varying float vHeight;
uniform vec3 waterColor;
uniform vec3 waterHighlight;
uniform vec3 waterFoam;

vec3 rampColor() 
{
    float water = 20.0;
    vec3 aqua = mix(waterColor, waterHighlight, vHeight / 8.0 - vHeight / water);
    return mix(aqua, waterFoam, vHeight / water);
}

void main()
{
    gl_FragColor = vec4(rampColor(), 1.0);
}
