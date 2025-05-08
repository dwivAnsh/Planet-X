import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
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

// HDRI Environment
const rgbeLoader = new RGBELoader();
rgbeLoader.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/4k/docklands_01_4k.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping; 
    scene.environment = texture;
});

const radius = 1.3; // radius of the planets
const segments = 64; // number of segments for the planets smoothness 
const orbitRadius = 4.6;
const textures = ['./csilla/color.png','./earth/map.jpg','./venus/map.jpg','./volcanic/color.png']
const spheres = new THREE.Group();


const starTexture = new THREE.TextureLoader().load('./stars.jpg');
starTexture.colorSpace = THREE.SRGBColorSpace;
const starGeometry = new THREE.SphereGeometry(50, 64, 64);
const starMaterial = new THREE.MeshStandardMaterial({
    map: starTexture,
    side: THREE.BackSide // Render the inside of the sphere
});

const starfield = new THREE.Mesh(starGeometry, starMaterial);
scene.add(starfield);

const sphereMesh = [];

for(let i = 0; i < 4; i++){
  const geometry = new THREE.SphereGeometry(radius, segments, segments);
  const material = new THREE.MeshStandardMaterial({ map: textures[i] } );
  const sphere = new THREE.Mesh(geometry, material);   

  const texture = new THREE.TextureLoader().load(textures[i]);
  material.map = texture;
  material.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;

  const angle = (i/4) * (Math.PI * 2);
  sphere.position.x = orbitRadius * Math.cos(angle); 
  sphere.position.z = orbitRadius * Math.sin(angle); 
  
  sphereMesh.push(sphere);

  spheres.rotation.x = 0.1;
  spheres.position.y = -0.9;
  spheres.add(sphere);
}

scene.add(spheres);

// Position camera
camera.position.z = 9;


// 2 seconds delay for finding the direction of the scroll
let lastScrollTime = 0;
let scrollCount = 0;
const scrollThrottleDelay = 2000; // 2 seconds in milliseconds

window.addEventListener('wheel', (e) => {
  const currentTime = Date.now();
  
  if (currentTime - lastScrollTime >= scrollThrottleDelay) {
    lastScrollTime = currentTime;

    const direction = e.deltaY > 0 ? "down" : "up";
    

    scrollCount = (scrollCount + 1) % 4;
    const headings = document.querySelectorAll('h1');
    gsap.to(headings, {
      duration: 1,
      y: `-=${100}%`,
      ease: "power2.inOut"
    });

    gsap.to(spheres.rotation, {
      duration: 1,
      y: direction === "down" ? spheres.rotation.y - Math.PI/2 : spheres.rotation.y + Math.PI/2,
      ease: "power2.inOut"
    });

    if(scrollCount === 0){
      gsap.to(headings, {
        duration: 1,
        y: `0`,
        ease: "power2.inOut"
      });
    }
  }
});


// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const clock = new THREE.Clock();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  for(let i = 0; i < sphereMesh.length; i++){
    sphereMesh[i].rotation.y += clock.getElapsedTime() * 0.0001;
  }
  renderer.render(scene, camera);
}
animate();
