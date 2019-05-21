var container, stats;
var camera, scene, renderer;
var mouse = new THREE.Vector2();
var theta = 0;
// create an AudioListener and add it to the camera
var listener = new THREE.AudioListener();

// create a global audio source
var sound = new THREE.Audio( listener );

// load a sound and set it as the Audio object's buffer
var audioLoader = new THREE.AudioLoader();
audioLoader.load( 'audio/01.mp3', function( buffer ) {
sound.setBuffer( buffer );
sound.setLoop( false );
sound.setVolume( 0.5 );
sound.play( true );
});
init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 1, 10000 );

  //Audio - Settings
  camera.add( listener );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  var light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 1, 1, 1 ).normalize();
  scene.add( light );
  var geometry = new THREE.SphereGeometry( 20, 20, 20, 20 );
  var geometry1 = new THREE.PlaneGeometry( 400, 400 );

  var texture = new THREE.TextureLoader().load('01.jpg');
  var texture1 = new THREE.TextureLoader().load('02.jpg');
  var material1 = new THREE.MeshBasicMaterial( { map: texture1} );
  var mesh1 = new THREE.Mesh( geometry1, material1);
      mesh1.position.x = 0;
      mesh1.position.y = 0;
      mesh1.position.z = -60;
      scene.add(mesh1);

      var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
    	for ( i = 0; i < faceVertexUvs.length; i ++ ) {
    		var uvs = faceVertexUvs[ i ];
    		var face = geometry.faces[ i ];
    		for ( var j = 0; j < 3; j ++ ) {
    			uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
    			uvs[ j ].y = face.vertexNormals[ j ].y * 0.5 + 0.5;
    		}
    	}

  for (var i=0; i<100; i++){
    var material = new THREE.MeshBasicMaterial( { map: texture ,
        color: Math.random() * 0xFFFFFF} );
    var mesh = new THREE.Mesh( geometry, material );
        var sizeRand = Math.random() * 0.5;
        mesh.scale.set(sizeRand,sizeRand,sizeRand);
        mesh.position.set(Math.random()*200-100, Math.random()*200-100, -50);
        var glowMesh	= new THREEx.GeometricGlowMesh(mesh)
        mesh.add(glowMesh.object3d)
        var insideUniforms	= glowMesh.insideMesh.material.uniforms
        insideUniforms.glowColor.value.set('#ffffff')
        var outsideUniforms	= glowMesh.outsideMesh.material.uniforms
  	    outsideUniforms.glowColor.value.set('#ffffff')
        scene.add(mesh);
  }
  for ( var i = 1, l = scene.children.length; i < l; i ++ ) {
					scene.children[ i ].lookAt( camera.position );
				}
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function animate() {
  requestAnimationFrame( animate );
  render();
  //stats.update();
}

function render() {
  theta += 0.005;
  camera.position.set(0, 0, 0);
  camera.rotation.z = theta;
  camera.updateMatrixWorld();
  renderer.render( scene, camera );
}
