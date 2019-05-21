var THREEx	= THREEx || {}

THREEx.GeometricGlowMesh	= function(mesh){
	var object3d	= new THREE.Object3D

	var geometry	= mesh.geometry.clone()
	THREEx.dilateGeometry(geometry, 10)
	var material	= THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value	= new THREE.Color('cyan')
	material.uniforms.coeficient.value	= 0
	material.uniforms.power.value		= 30
	var insideMesh	= new THREE.Mesh(geometry, material );
	object3d.add( insideMesh );


	var geometry	= mesh.geometry.clone()
	THREEx.dilateGeometry(geometry, 10)
	var material	= THREEx.createAtmosphereMaterial()
	material.uniforms.glowColor.value	= new THREE.Color('cyan')
	material.uniforms.coeficient.value	= 0
	material.uniforms.power.value		= 0.8
	material.side	= THREE.BackSide
	var outsideMesh	= new THREE.Mesh( geometry, material );
	object3d.add( outsideMesh );

	// expose a few variable
	this.object3d	= object3d
	this.insideMesh	= insideMesh
	this.outsideMesh= outsideMesh
}
