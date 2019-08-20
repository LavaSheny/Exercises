//Global variables
var renderer, scene, camera;
var controls, material, geometry;
var objects = [];
var randomRotationX = [];
var randomRotationY = [];

function init() {
  // Create an empty scene.
  scene = new THREE.Scene();
  // Create a basic perspective camera.
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  camera.position.set(0, 55, 85);
  camera.lookAt(scene.position);
  // Configure spotlight.
  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(1000, 0, 1000);
  scene.add(spotLight);
  // Configure amblight.
  var ambLight = new THREE.AmbientLight(0xFFFFFF);
  ambLight.position.set(0,10000,0);
  ambLight.add(spotLight);
  scene.add(ambLight);
  // Create a renderer with Antialiasing.
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setPixelRatio( window.devicePixelRatio );
  // Configure renderer size.
  renderer.setSize( window.innerWidth, window.innerHeight );
  // Configure renderer clear color.
  renderer.setClearColor(0x000000);
  // Let camera can be controled by mouse.
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableRotate = true;
  // Set random selection range.
  var randomSelection = Math.round(Math.random()*6)+1;

  // Load random textures.
  var	texture = new THREE.TextureLoader().load( "textures/texture"+randomSelection+".jpg" );
  // Load selected texture.
  var	texture1 = new THREE.TextureLoader().load( "textures/texture7.jpg" );
  //Create a three dimensional grid of objects, and position them accordingly.
  for (var x = -10; x <= 5; x += 5) { // Start from -10 and sequentially add one every 5 pixels.
  for (var y = -10; y <= 5; y += 5) {
  for (var z = -10; z <= 5; z += 5) {
      if (x >= 0 && y >=0 && z >=0){ // Create different kinds of geometries in different domains.
      geometry = new THREE.BoxGeometry(3, 3, 3);
    } else if ( x <= 0 && y >= 0 && z >=0){
      geometry = new THREE.ConeGeometry( 2, 3, 32);
    } else if ( x >= 0 && y <= 0 && z >=0){
      geometry = new THREE.CylinderGeometry( 2, 2, 3, 32 );
    } else if ( x >= 0 && y >= 0 && z <=0){
      geometry = new THREE.IcosahedronGeometry(3, 0);
    } else if ( x <= 0 && y <= 0 && z >=0){
      geometry = new THREE.SphereGeometry( 2, 32, 32 );
    } else if ( x <= 0 && y >= 0 && z <=0){
      geometry = new THREE.TetrahedronGeometry(3, 0);
    } else if ( x >= 0 && y <= 0 && z <=0){
      geometry = new THREE.TorusGeometry( 2, 1, 8, 6 );
    } else {
      geometry = new THREE.OctahedronGeometry(3, 0);
    }

      if (x >= 0 && y >=0 && z >=0){ // Create different kinds of materials in different domains.
      material = new THREE.MeshLambertMaterial( {color: Math.random() * 0xFFFFFF} );
    } else if ( x <= 0 && y >= 0 && z >=0){
      material = new THREE.MeshBasicMaterial( { color: 0xffaa00, transparent: true, blending: THREE.AdditiveBlending } );
    } else if ( x >= 0 && y <= 0 && z >=0){
      material = new THREE.MeshLambertMaterial( { map: texture1, transparent: true } );
    } else if ( x >= 0 && y >= 0 && z <=0){
      material = new THREE.MeshLambertMaterial( {color: 0x355C7D} );
    } else if ( x <= 0 && y <= 0 && z >=0){
      material = new THREE.MeshBasicMaterial( { map: texture} );
    } else if ( x <= 0 && y >= 0 && z <=0){
      material = new THREE.MeshNormalMaterial( { flatShading: true } );
    } else if ( x >= 0 && y <= 0 && z <=0){
      material = new THREE.MeshBasicMaterial( { color: 0xffaa00, wireframe: true } );
    } else {
      material = new THREE.MeshPhongMaterial( { color: 0x6C5B7B, specular: 0x666666, emissive: 0xff0000, shininess: 10, opacity: 0.5, transparent: true } );
    }
  // Create mesh and configure the position of mesh.
  var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = x;
      mesh.position.y = y;
      mesh.position.z = z;
  // Create random speed values of rotation.
  var randomValueX = (Math.random() * 0.1)- 0.05;
  var randomValueY = (Math.random() * 0.1)- 0.05;
  // push value array to rotation speeds.
      randomRotationX.push(randomValueX);
      randomRotationY.push(randomValueY);
  // Add the mesh to the scene.
      scene.add(mesh);
  // push mesh array to objects.
      objects.push(mesh);
  }
  }
}
  // Append Renderer to DOM.
  document.body.appendChild(renderer.domElement);
  // Add a series of listening events.
  window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener( "mousemove", onDocumentMouseMove, false );
}
// Render Loop.
function drawFrame(){
  requestAnimationFrame(drawFrame);

  objects.forEach(function(o,i){ // Rotate the objects independently.
    o.rotation.x += randomRotationX[i];
    o.rotation.y += randomRotationY[i];
  });

  // Render the scene.
  renderer.render(scene, camera);
}
// Events triggered when the mouse moves.
function onWindowResize() {
  // Change the camera's aspect attribute to the width and height of the current window.
	camera.aspect = window.innerWidth / window.innerHeight;
  // Updating the projection matrix of the camera.
	camera.updateProjectionMatrix();
  // Reset scene width and height.
	renderer.setSize( window.innerWidth, window.innerHeight );
}
	  var selectedObject = null;
function onDocumentMouseMove( event ) {
			event.preventDefault();
    // get the div element which I added in index.html to show object number; I also link .css file in .html file.
    var textfiled = document.getElementById("objectinfo");
    // hide object number when select the objects.
			if ( selectedObject ) {
				selectedObject = null;
        textfiled.style.display="none";
			}
    // Judge whether objects intersect with raycaster.
		var intersects = getIntersects( event.layerX, event.layerY );
			if ( intersects.length > 0 ) {// The position of the point in the mouse point minus the offset vector, and the new position is assigned to the selected object.
				var res = intersects[ 0 ];
				if ( res && res.object ) {
					selectedObject = res.object;
    // I use position of selected object to calculate the number of objects.
    var num =(selectedObject.getWorldPosition().x/5+3)+(selectedObject.getWorldPosition().y/5+3-1)*4+(selectedObject.getWorldPosition().z/5+3-1)*16;
        //set object number I calculated before.
        textfiled.textContent = num.toString();
        //show object number.
        textfiled.style.display="block";
        //set the number position.
        textfiled.style.top =  event.clientY+10+"px";
        textfiled.style.left = event.clientX+10+"px";
				}
			}
		}
    //Create a raycaster.
		var raycaster = new THREE.Raycaster();
    //Create a new Two-Dimensional Transform Semi-Unit Vector.
		var mouseVector = new THREE.Vector2();
		function getIntersects( x, y ) {
			x = ( x / window.innerWidth ) * 2 - 1;
			y = - ( y / window.innerHeight ) * 2 + 1;
      //Screen and raycaster convert this vector from screen to scene based on the camera.
			mouseVector.set( x, y );
			raycaster.setFromCamera( mouseVector, camera );
      // Set recursion to "true" and for .intersectObject for each child. Once an array is established, it calls the callback function provided on the array.
			return raycaster.intersectObjects( scene.children, true );
		}
init();
drawFrame();
