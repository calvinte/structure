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
  /*
  if (blockId == 81) {
    //torch
    return new Array(2,10,2);
  }
  else if (blockId == 135 || blockId == 136 ) {
    //bed
    return new Array(16,9,16);
  }
  else {*/
    return new Array(16,16,16);
  //}
}

/* Provide texture for block
 * 
 * @param textureId as Number representing block id
 * 
 * @return THREE.MeshLambertMaterial or array of six THREE.MeshLambertMaterial depending on textureId
 */
function blockTexture(textureId) {
  function sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide) {
    materials = new Array;
    sides = new Array(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
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
      texturePosition = sides[i];
      texture.offset.x = texturePosition[0]/16;
      texture.offset.y = texturePosition[1]/16;
      materials.push(new THREE.MeshLambertMaterial( {map:texture, transparent: true} ));
    }
    return materials;
  }
  
  switch (textureId) {    
    
    case '2': //Grass
      leftSide =   Array(3,0);
      rightSide =  Array(3,0);
      topSide =    Array(0,0);
      bottomSide = Array(2,0);
      frontSide =  Array(3,0);
      backSide =   Array(3,0);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
  
    case '17': //Wood
      leftSide =   Array(4,1);
      rightSide =  Array(4,1);
      topSide =    Array(5,1);
      bottomSide = Array(5,1);
      frontSide =  Array(4,1);
      backSide =   Array(4,1);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '17:1': //Wood (Pine)
      leftSide =   Array(4,7);
      rightSide =  Array(4,7);
      topSide =    Array(5,1);
      bottomSide = Array(5,1);
      frontSide =  Array(4,7);
      backSide =   Array(4,7);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '17:2': //Wood (Birch)
      leftSide =   Array(5,7);
      rightSide =  Array(5,7);
      topSide =    Array(5,1);
      bottomSide = Array(5,1);
      frontSide =  Array(5,7);
      backSide =   Array(5,7);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break
      
    case '23': //Dispenser
      leftSide =   Array(13,2);
      rightSide =  Array(13,2);
      topSide =    Array(14,3);
      bottomSide = Array(14,3);
      frontSide =  Array(14,2);
      backSide =   Array(13,2);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
      
    case '29': //Sticky Piston
      leftSide =   Array(12,6);
      rightSide =  Array(12,6);
      topSide =    Array(10,6);
      bottomSide = Array(13,6);
      frontSide =  Array(12,6);
      backSide =   Array(12,6);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '33': //Piston
      leftSide =   Array(12,6);
      rightSide =  Array(12,6);
      topSide =    Array(11,6);
      bottomSide = Array(13,6);
      frontSide =  Array(12,6);
      backSide =   Array(12,6);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '46': //TNT
      leftSide =   Array(8, 0);
      rightSide =  Array(8, 0);
      topSide =    Array(9, 0);
      bottomSide = Array(10,0);
      frontSide =  Array(8, 0);
      backSide =   Array(8, 0);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '47': //Bookshelf
      leftSide =   Array(3,2);
      rightSide =  Array(3,2);
      topSide =    Array(4,0);
      bottomSide = Array(4,0);
      frontSide =  Array(3,2);
      backSide =   Array(3,2);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '54': //Chest
      leftSide =   Array(10,1);
      rightSide =  Array(10,1);
      topSide =    Array(9, 1);
      bottomSide = Array(9, 1);
      frontSide =  Array(11,1);
      backSide =   Array(10,1);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
     
    case '58': //Crafting Table
      leftSide =   Array(11,3);
      rightSide =  Array(12,3);
      topSide =    Array(11,2);
      bottomSide = Array(11,2);
      frontSide =  Array(11,3);
      backSide =   Array(12,3);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '61': //Furnace
      leftSide =   Array(13,2);
      rightSide =  Array(13,2);
      topSide =    Array(14,3);
      bottomSide = Array(14,3);
      frontSide =  Array(12,2);
      backSide =   Array(13,2);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
      
    case '62': //Furnace (Smelting)
      leftSide =   Array(13,2);
      rightSide =  Array(13,2);
      topSide =    Array(14,3);
      bottomSide = Array(14,3);
      frontSide =  Array(13,3);
      backSide =   Array(13,2);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
      
    case '81': //Cactus
      leftSide =   Array(6,4);
      rightSide =  Array(6,4);
      topSide =    Array(5,4);
      bottomSide = Array(5,4);
      frontSide =  Array(6,4);
      backSide =   Array(6,4);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
          
    case '84': //Jukebox
      leftSide =   Array(10,4);
      rightSide =  Array(10,4);
      topSide =    Array(11,4);
      bottomSide = Array(10,4);
      frontSide =  Array(10,4);
      backSide =   Array(10,4);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
    
    case '86': //Pumpkin
      leftSide =   Array(6,7);
      rightSide =  Array(6,7);
      topSide =    Array(6,6);
      bottomSide = Array(6,7);
      frontSide =  Array(7,7);
      backSide =   Array(6,7);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
          
    case '91': //Jack-o-Lantern
      leftSide =   Array(6,7);
      rightSide =  Array(6,7);
      topSide =    Array(6,6);
      bottomSide = Array(6,7);
      frontSide =  Array(8,7);
      backSide =   Array(6,7);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
         
    case '92': //Cake (Block)
      leftSide =   Array(10,7);
      rightSide =  Array(10,7);
      topSide =    Array(9, 7);
      bottomSide = Array(11,7);
      frontSide =  Array(10,7);
      backSide =   Array(10,7);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
      
    case '103': //Melon (Block)
      leftSide =   Array(8,8);
      rightSide =  Array(8,8);
      topSide =    Array(9,8);
      bottomSide = Array(8,8);
      frontSide =  Array(8,8);
      backSide =   Array(8,8);
      return sides(leftSide,rightSide,topSide,bottomSide,frontSide,backSide);
      break;
      
    default: //wildcard
      material = sides(spritePosition(textureId));
      material.map.offset.x /= 16;
      material.map.offset.y /= 16;
      return material;
  }
  
}