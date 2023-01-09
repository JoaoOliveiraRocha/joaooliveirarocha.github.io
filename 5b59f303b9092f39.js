import"./style.css";import{DRACOLoader}from"three/examples/jsm/loaders/DRACOLoader.js";import{GLTFLoader}from"three/examples/jsm/loaders/GLTFLoader.js";import{KTX2Loader}from"three/examples/jsm/loaders/KTX2Loader.js";import{MeshoptDecoder}from"three/examples/jsm/libs/meshopt_decoder.module.js";import{OrbitControls}from"three/examples/jsm/controls/OrbitControls";import{wooble}from"./animations";import{GUI}from"dat.gui";import*as THREE from"three";const canvas=document.getElementById("webgl"),viewport={height:window.innerHeight,width:window.innerWidth},planeProps={color:2271778,metalness:.1,roughness:.25},gui=new GUI,renderer=new THREE.WebGLRenderer({canvas});renderer.shadowMap.enabled=!0,renderer.shadowMap.type=THREE.PCFSoftShadowMap,renderer.setSize(viewport.width,viewport.height),renderer.setPixelRatio(Math.min(2,window.devicePixelRatio));const scene=new THREE.Scene,axh=new THREE.AxesHelper;scene.add(axh);const loadingManager=new THREE.LoadingManager;loadingManager.onStart=()=>{console.log("Starting")},loadingManager.onLoaded=()=>{console.log("Loaded")},loadingManager.onProgress=()=>{console.log("Progress")},loadingManager.onError=()=>{console.log("ERROR")};const DRACO_LOADER=new DRACOLoader(loadingManager),KTX2_LOADER=new KTX2Loader(loadingManager),gltfLoader=new GLTFLoader(loadingManager).setDRACOLoader(DRACO_LOADER).setKTX2Loader(KTX2_LOADER.detectSupport(renderer)).setMeshoptDecoder(MeshoptDecoder);let object;gltfLoader.load("/models/poop_full_res.glb",(e=>{const o=e.scene;e.scene.scale.set(.025,.025,.025),o.castShadow=!0,o.children.forEach((e=>{e.castShadow=!0})),object=o,scene.add(o);const n=gui.addFolder("Object");n.add(object.position,"x",-2,2,.005),n.add(object.position,"y",-2,2,.005),n.add(object.position,"z",-2,2,.005)}));const plane=new THREE.Mesh(new THREE.PlaneGeometry(8,8),new THREE.MeshStandardMaterial({...planeProps}));plane.receiveShadow=!0,plane.rotation.x=-Math.PI/2,plane.position.y=-1,scene.add(plane);const planeFolder=gui.addFolder("Plane");planeFolder.addColor(planeProps,"color").name("Plane Color").onChange((()=>{plane.material.color.set(planeProps.color)})),planeFolder.add(planeProps,"roughness",0,1,.01).name("Plane Roughness").onChange((()=>{plane.material.roughness=planeProps.roughness})),planeFolder.add(planeProps,"metalness",0,1,.01).name("Plane metalness").onChange((()=>{plane.material.metalness=planeProps.metalness}));const ambientLight=new THREE.AmbientLight(16777215,.3),sunLight=new THREE.DirectionalLight(16777215,.8);sunLight.position.x=1,sunLight.position.y=3,sunLight.position.z=.25,sunLight.shadow.camera.top=5,sunLight.shadow.camera.far=12,sunLight.shadow.camera.near=.05;const lightsFolder=gui.addFolder("Lights");lightsFolder.add(ambientLight,"intensity",0,1,.001).name("Ambient"),lightsFolder.add(sunLight,"intensity",0,1,.001),lightsFolder.add(sunLight.position,"x",-3,3,.005),lightsFolder.add(sunLight.position,"y",0,5,.005),lightsFolder.add(sunLight.position,"z",-3,3,.005),lightsFolder.addColor(sunLight,"color").name("Light Color").onChange((e=>{sunLight.color.r=e.r/256,sunLight.color.g=e.g/256,sunLight.color.b=e.b/256})),sunLight.castShadow=!0,sunLight.shadow.mapSize.width=2048,sunLight.shadow.mapSize.height=2048;const sunLightHelper=new THREE.DirectionalLightHelper(sunLight),shadowsHelper=new THREE.CameraHelper(sunLight.shadow.camera);scene.add(ambientLight),scene.add(sunLight),scene.add(sunLightHelper),scene.add(shadowsHelper);const camera=new THREE.PerspectiveCamera(60,viewport.width/viewport.height,.1,500);camera.position.set(2.75,2,2.25);const controls=new OrbitControls(camera,renderer.domElement);controls.update();const tick=e=>{object&&wooble(object,e),renderer.render(scene,camera),window.requestAnimationFrame(tick)};window.addEventListener("resize",(()=>{viewport.height=window.innerHeight,viewport.width=window.innerWidth,camera.aspect=viewport.width/viewport.height,camera.updateProjectionMatrix(),renderer.setSize(viewport.width,viewport.height),renderer.setPixelRatio(Math.min(2,window.devicePixelRatio))})),tick();