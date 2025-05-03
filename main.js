import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
// Create scene, camera and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);


// Set pixel ratio and size
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ 
    canvas ,
    antialias: true // for smooth edges
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

const radius = 1.3; // radius of the planets
const segments = 64; // number of segments for the planets smoothness 
const orbitRadius = 4.6;
const colors = [0x00ff00, 0x0000ff, 0xff00ff, 0xffff00];
const spheres = new THREE.Group();

for(let i = 0; i < 4; i++){
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshBasicMaterial({ color: colors[i] } );
  const sphere = new THREE.Mesh(geometry, material);

  const angle = (i/4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle); // 3 is orbit radius
  sphere.position.z = orbitRadius * Math.sin(angle); 
  
  spheres.rotation.x = 0.1;
  spheres.position.y = -0.9;
  spheres.add(sphere);
}

scene.add(spheres);

// Position camera
camera.position.z = 9;

// setInterval(() => {
//   gsap.to(spheres.rotation, {
//     y: `+=${Math.PI / 2}`,
//     ease: "expo.easeInOut",
//     duration: 2
//   });
// }, 2500);

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
