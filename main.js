import * as THREE from 'https://cdn.skypack.dev/three@0.132.2';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js';

// Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Lighting
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(pointLight, ambientLight);

// Background particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0xffffff
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Torus
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ 
    color: 0x6c63ff,
    wireframe: true
});
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Scroll Animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    
    torus.rotation.x += 0.05;
    torus.rotation.y += 0.075;
    torus.rotation.z += 0.05;
    
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    torus.rotation.x += 0.001;
    torus.rotation.y += 0.002;
    torus.rotation.z += 0.001;

    particlesMesh.rotation.y += 0.0005;

    renderer.render(scene, camera);
}

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Intersection Observer for section animations
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

sections.forEach(section => observer.observe(section));

// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
        loadingScreen.style.display = 'none';
    }, 500);
    animate();
});
