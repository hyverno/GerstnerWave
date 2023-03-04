import './style.css'

import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// ===========================================

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('src/zone.png');
console.log(texture)

const uniforms = {
  u_time: {type: 'f',value: 0.0},
  waterColor: {
    value: new THREE.Color("#4988cf")
  },
  waterHighlight: {
    value: new THREE.Color("#7baee9")
  },
  waterFoam: {
    value: new THREE.Color("#FFFFFF")
  },
  cameraPosition: {
    value: camera.position
  },
  position: {
    value: new THREE.Vector3(1.0, 1.0, 1.0)
  },
  myTexture: {
    value: texture
  }
};

import vertexShader from './src/vertex.glsl'
import fragmentShader from './src/fragment.glsl'
const myshader =  new THREE.RawShaderMaterial({
  uniforms      : uniforms,
  fragmentShader: fragmentShader,
  vertexShader  : vertexShader,
  side: THREE.DoubleSide,
  wireframe: true,
});

camera.position.z = 150;
const controls = new OrbitControls(camera, renderer.domElement)
const resolution = 10

// const planeMat = new THREE.MeshPhongMaterial({ color: '0x546658', wireframe:true});
const planeGeo = new THREE.PlaneGeometry(200,200,resolution,resolution);
planeGeo.receiveShadow = true

const arr = []

for ( let i = 0; i < 4; i ++ ) {
  for ( let j = 0; j < 4; j ++ ) {
    const ls = new THREE.Mesh(planeGeo, myshader);
    ls.position.x += 200 * i;
    ls.position.z += 200 * j;
    ls.rotation.x = Math.PI / 2
    scene.add(ls);
    arr.push(ls);
  }
}
const Rmin = 20;
const Rmax = 500;

function updateGeometry( obj, res ) {
  obj.geometry = new THREE.PlaneGeometry(200, 200, res, res);
}

controls.addEventListener('change', () => {
  updateWaveGeometry()
})

function updateWaveGeometry() {
  arr.forEach( (k, i) => {
    const some = 
      Math.sqrt(
        Math.pow((k.position.x - camera.position.x), 2)+
        Math.pow((k.position.y - camera.position.y), 2)+
        Math.pow((k.position.z - camera.position.z), 2)
      );

    const r = some; 
    if (r >= Rmax) {
      updateGeometry(k, Rmin);
    }
    if (r <= Rmax && r >= 100) {
      updateGeometry(k, Math.floor((Rmax - r) / 4) > Rmin ? (Rmax - r) / 4 : Rmin)
    }
  });
}

/*
 *  Create test
 */

const color = 0xFF547f;
const intensity = 1000;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-10, 10, 10);
scene.add(light);
scene.add(light.target);


function animate() {
  requestAnimationFrame( animate );
  myshader.uniforms.u_time.value += 0.01;
  myshader.uniforms.cameraPosition.value = camera.position;
  renderer.render( scene, camera );
};

animate();
updateWaveGeometry();


/**
 * options
 */

// let effectController = {
//   newTess: 15,
//   bottom: true,
//   lid: true,
//   body: true,
//   fitLid: false,
//   nonblinn: false,
//   newShading: 'glossy'
// };

// const gui = new GUI();
// gui.add( effectController, 'newTess', [ 2, 3, 4, 5, 6, 8, 10, 15, 20, 30, 40, 50 ] ).name( 'Tessellation Level' ).onChange( renderer );
// gui.addColor("242424",'newTest')
