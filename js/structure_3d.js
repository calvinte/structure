(function ($) {
  $(document).ready(function(){
    function initiate3d() {
      container = $('#mc-3d .canvas-wrapper');

      camera = new THREE.PerspectiveCamera( 45, 800 / 500, 1, 2000 );
      camera.position.set( 0, 200, 200 );


      renderer = new THREE.WebGLRenderer();
      renderer.setSize( $('#mc-3d .canvas-wrapper').innerWidth() , $('#mc-3d .canvas-wrapper').innerHeight() );

      $('#mc-3d .canvas-wrapper').append( renderer.domElement );
    }

    initiate3d();
    animate();
    line = drawGrid(scene, 0);
    renderer.render(scene, camera);
    $('#mc-3d .zoom-in').click(function() {
      console.log('zooming in' + currentZoom);
      currentZoom -= 50;
      camera.position.set( 0, currentZoom + 200, 200);
    });

    $('#mc-3d .zoom-out').click(function() {
        console.log('zooming out ' + currentZoom);
        currentZoom += 50;
        camera.position.set( 0, currentZoom + 200, 200);
    });
  });
})(jQuery); 

scene = new THREE.Scene();
addLights();
var currentZoom = new Number;
var currentZoom = new Number;

function blockTexture(textureId) {
  if (textureId == 1) {
  var blockTop    = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_1.png' ) } );
  var blockSides  = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_4.png' ) } );
  var blockBottom = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_3.png' ) } );
   
  return new Array(
    blockSides,  // Left side
    blockSides,  // Right side
    blockTop,    // Top side
    blockBottom, // Bottom side
    blockSides,  // Front side
    blockSides   // Back side
  );
  }
  else if (textureId == 22) {
  var blockTop    = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_22.png' ) } );
  var blockSides  = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_21.png' ) } );
   
  return new Array(
    blockSides,  // Left side
    blockSides,  // Right side
    blockTop,    // Top side
    blockTop,    // Bottom side
    blockSides,  // Front side
    blockSides   // Back side
  );
  }
  else if (textureId == 28) {
  var blockTop    = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_26.png' ) } );
  var blockFront  = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_28.png' ) } );
  var blockSides  = new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_27.png' ) } );
   
  return new Array(
    blockSides,  // Left side
    blockSides,  // Right side
    blockTop,    // Top side
    blockTop,    // Bottom side
    blockFront,  // Front side
    blockSides   // Back side
  );
  }
  else {
  //create material
  return new THREE.MeshLambertMaterial( { map: THREE.ImageUtils.loadTexture( '/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + textureId + '.png' ), transparent: true } );
  }
}

function drawGrid(scene, Z, line) {
  if(line) {
    scene.remove(line);
  }
  var line_material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ),
          geometry = new THREE.Geometry(),
              floor = -8 + (Z*16), step = 16;

  for ( var i = 0; i <= 16; i ++ ) {
  geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - 128, floor, i * step - 128 ) ) );
  geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   128, floor, i * step - 128 ) ) );

  geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - 128, floor, -128 ) ) );
  geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - 128, floor,  128 ) ) );
  }

  var line = new THREE.Line( geometry, line_material, THREE.LinePieces );
  scene.add(line);

  return line;
}

function drawBlock(block) {
  if (block[3] !=  0) {
    size = 16;

    var CubeMaterial = blockTexture(block[3]);
    
    //create cube
    var Cube = new THREE.Mesh(
    new THREE.CubeGeometry(size,size,size,1,1,1),CubeMaterial);  
    //position
    Cube.position['y'] = (block[0]*size);
    Cube.position['x'] = (block[1]-8)*size+8;
    Cube.position['z'] = (block[2]-8)*-size-8;

    //draw
    scene.add(Cube);

    block[4] = Cube;
  }
  return block;
}

function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  var timer = new Date().getTime() * 0.0001;

  camera.position.x = Math.cos( timer ) * 300;
  camera.position.z = Math.sin( timer ) * 300;
  camera.lookAt( scene.position );

  renderer.render( scene, camera );
}

function addLights() {
  //create
  var pointLight1 = new THREE.PointLight( 0x999999 );
  //position
  pointLight1.position.x = 500;
  pointLight1.position.y = 500;
  pointLight1.position.z = 500;
  //create
  var pointLight2 = new THREE.PointLight( 0x999999 );
  //position
  pointLight2.position.x = -500;
  pointLight2.position.y = 500;
  pointLight2.position.z = 500;
  //create
  var ambientLight = new THREE.AmbientLight( 0x999999 );
  //draw 
  scene.add(pointLight1);
  scene.add(pointLight2);
  scene.add(ambientLight);
}

function drawBlocks(blocks, scene) {
  for(var i=0; blocks[i]; i++) {
    drawBlock(blocks[i], scene);
  }
}

function killBlock(Cube) {
  scene.remove(Cube);
}
