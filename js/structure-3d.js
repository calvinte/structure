/* Initiate Webd GL / Three.JS
 */
function initiate3d() {
  (function ($) {
    $(document).ready(function(){
      startTime = new Date().getTime();
      
      container = $('#mc-3d .canvas-wrapper');
      container.empty();

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 45, container.innerWidth()/container.innerHeight(), 1, 2000 );
      camera.position.set( 0, 200, 200 );

      renderer = new THREE.WebGLRenderer();
      renderer.setSize( container.innerWidth() ,container.innerHeight() );
      $('#mc-3d .canvas-wrapper').append( renderer.domElement );

      animate();
      render();

      grid = drawGrid(scene, 0);


      addLights();

      var currentZoom = new Number;
      var currentZoom = new Number;

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
      
      //execution time ~1ms/block in Chrome on 111126
      for(var i=0; blocks[i]; i++) {
        drawBlock(blocks[i], scene);
      }
      
      endTime = new Date().getTime();
      console.log('Execution time of initiate3d(): ' + (Number(endTime) - Number(startTime)));
    });
  })(jQuery); 
}

/* Draw 3D x-y axis grid in three.js scene (average execution time less than 1ms on 111126)
 * 
 * @param scene as three.js scene
 * @param Z as number representing z-axis to draw grid
 * @param grid as the last return of this function
 * 
 * @return grid as THREE.Line object 
 */
function drawGrid(scene, Z, grid) {
  if(grid) {
    scene.remove(grid);
  }
  var grid_material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } ),
          geometry = new THREE.Geometry(),
              floor = -8 + (Z*16), step = 16;

  for ( var i = 0; i <= 16; i ++ ) {
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( - 128, floor, i * step - 128 ) ) );
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3(   128, floor, i * step - 128 ) ) );

    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - 128, floor, -128 ) ) );
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( i * step - 128, floor,  128 ) ) );
  }

  var grid = new THREE.Line( geometry, grid_material, THREE.LinePieces );
  scene.add(grid);

  return grid;
}

/* Draw THREE.Mesh object (average execution time in Chrome less than 1ms on 111126)
 * 
 * @param block as array with paramaters z,x,y
 * 
 * @renturn block as array with additional paramater of THREE.Mesh object
 */
function drawBlock(block) {
  if (block[3] !=  0) {
    size = 16;
    
    var Cube = generateBlock(block[3]);
    
    //position
    Cube.position['y'] += (block[0]*size);
    Cube.position['x'] += (block[2]-8)*-size-8;
    Cube.position['z'] += (block[1]-8)*size+8;
    
    if (block[4] == 1 || block[4] == 3) {
      Cube.rotation['y'] = ((block[4]*90)+90)*(Math.PI / 180);
    }
    else {
      Cube.rotation['y'] = ((block[4]*90)-90)*(Math.PI / 180);
    }
        
    //draw
    scene.add(Cube);

    block[5] = Cube;
  }
  return block;
}

/* Animate THREE.Scene
 */
function animate() {
  requestAnimationFrame( animate );
  render();
}

/* Render THREE.Scene
 */
function render() {
  var timer = new Date().getTime() * 0.0001;

  camera.position.x = Math.cos( timer ) * 300;
  camera.position.z = Math.sin( timer ) * 300;
  camera.lookAt( scene.position );
  
  renderer.render( scene, camera );
}

/* Light THREE.Scene (average execution time 1ms on 111126)
 */
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

/* Remove THREE.Mesh from THREE.Scene
 * 
 * @param Cube as THREE.Mesh object
 */
function killBlock(Cube) {
  scene.remove(Cube);
}

function generateBlock(blockId) {
  if (blockId == 81) {
    //create cube
    var BlockMaterial = blockTexture(blockId);
    var BlockGeometry = blockGeometry(blockId);
    var Cube = new THREE.Mesh(new THREE.CubeGeometry(BlockGeometry[0],BlockGeometry[1],BlockGeometry[2],1,1,1,BlockMaterial), new THREE.MeshFaceMaterial());
    Cube.position['y'] -= 3;
    return Cube;
  }
  else {
    //create cube
    var BlockMaterial = blockTexture(blockId);
    var BlockGeometry = blockGeometry(blockId);
    return new THREE.Mesh(new THREE.CubeGeometry(BlockGeometry[0],BlockGeometry[1],BlockGeometry[2],1,1,1,BlockMaterial), new THREE.MeshFaceMaterial());
  }
}

function blockGeometry(blockId) {
  if (blockId == 81) {
    //torch
    return new Array(2,10,2);
  }
  else if (blockId == 135 || blockId == 136 ) {
    //bed
    return new Array(16,9,16);
  }
  else {
    return new Array(16,16,16);
  }
}

/* Provide texture for block
 * 
 * @param textureId as Number representing block id
 * 
 * @return THREE.MeshLambertMaterial or array of six THREE.MeshLambertMaterial depending on textureId
 */
function blockTexture(textureId) {
  function sides(left,right,top,bottom,front,back) {
    materials = new Array;
    sides = new Array(left,right,top,bottom,front,back);
    for (var i=0;i<=5;i++) {
      if (!sides[i]) {
        materials = materials[0];
        i = 5;
        break;
      }
      texture = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/mc-sprite.png');
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.repeat.x = .0625;
      texture.repeat.y = .0625;
      texturePosition = spritePosition(sides[i]);
      texture.offset.x = texturePosition[0]/256;
      texture.offset.y = texturePosition[1]/256;
      materials.push(new THREE.MeshLambertMaterial( {map:texture, transparent: true} ));
    }
    return materials;
  }
  
  switch (textureId) {
    default:
      //wildcard
      return sides(textureId);
  }
  
}