varying float vHeight;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;
uniform float u_time;
uniform vec3 cameraPosition;
uniform sampler2D myTexture;
attribute vec3 position;
attribute vec2 uv;

struct GerstnerWaveParams {
    vec2 direction;   // Direction of the wave
    float steepness;  // Steepness/Sharpness of the peaks
    float wavelength; // Wavelength...self explnitory
};

vec3 gerstnerWave(vec2 position, GerstnerWaveParams params, float time)
{
    float steepness = params.steepness;
    float wavelength = params.wavelength;

    float k = 2.0 * 3.14 / wavelength;
    float speed = sqrt(9.8 / k);
    vec2 d = normalize(params.direction);
    float f = k * (dot(d, position) - speed * time);
    float amplitude = steepness / k;

    return vec3(
        d.x * (amplitude * cos(f)),
        amplitude * sin(f),
        d.y * (amplitude * cos(f))
    );
}

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.xzy += gerstnerWave(modelPosition.xz, 
        GerstnerWaveParams(vec2(0.0, -1.0), 0.24, 120.0)
        , u_time);
    modelPosition.xzy += gerstnerWave(modelPosition.xz, 
        GerstnerWaveParams(vec2(-1.0, 0.5), 0.32, 145.0)
        , u_time);
    modelPosition.xzy += gerstnerWave(modelPosition.xz, 
        GerstnerWaveParams(vec2(-1.0, 0.7), 0.52, 30.0)
        , u_time);
    modelPosition.xzy += gerstnerWave(modelPosition.xz, 
        GerstnerWaveParams(vec2(0.0, 0.3), 0.35, 50.0)
        , u_time);



    modelPosition.y *= -1.0;
    modelPosition.y += texture2D(myTexture, modelPosition.xz / 800.0).y * 10.0;

    // calculate texture uv
    // pos de mon vertex (world) / taille de la texture 
    // modelPosition / myTexture

    vec4 viewPosition = viewMatrix * modelPosition; 
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    vHeight = modelPosition.y;
}