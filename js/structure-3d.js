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
    Cube.position['x'] += (block[1]-8)*size+8;
    Cube.position['z'] += (block[2]-8)*-size-8;
        
    //draw
    scene.add(Cube);

    block[4] = Cube;
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
    console.log(Cube.position['z']);
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
    if (left) {
        var textureLeft = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + left + '.png');
            textureLeft.wrapS = THREE.ClampToEdgeWrapping;
            textureLeft.wrapT = THREE.ClampToEdgeWrapping;
            textureLeft.magFilter = THREE.NearestFilter;
            textureLeft.minFilter = THREE.LinearMipMapLinearFilter;
        var materialLeft    = new THREE.MeshLambertMaterial( {map:textureLeft, transparent: true} );
    }
    if (right) {
      var textureRight = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + right + '.png');
          textureRight.wrapS = THREE.ClampToEdgeWrapping;
          textureRight.wrapT = THREE.ClampToEdgeWrapping;
          textureRight.magFilter = THREE.NearestFilter;
          textureRight.minFilter = THREE.LinearMipMapLinearFilter;
      var materialRight    = new THREE.MeshLambertMaterial( {map:textureRight, transparent: true} );
    }
    
    if (top) {
      var textureTop = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + top + '.png');
          textureTop.wrapS = THREE.ClampToEdgeWrapping;
          textureTop.wrapT = THREE.ClampToEdgeWrapping;
          textureTop.magFilter = THREE.NearestFilter;
          textureTop.minFilter = THREE.LinearMipMapLinearFilter;
      var materialTop    = new THREE.MeshLambertMaterial( {map:textureTop, transparent: true} );
    }
    
    if (bottom) {
      var textureBottom = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + bottom + '.png');
          textureBottom.wrapS = THREE.ClampToEdgeWrapping;
          textureBottom.wrapT = THREE.ClampToEdgeWrapping;
          textureBottom.magFilter = THREE.NearestFilter;
          textureBottom.minFilter = THREE.LinearMipMapLinearFilter;
      var materialBottom    = new THREE.MeshLambertMaterial( {map:textureBottom, transparent: true} );
    }
    
    if (front) {
      var textureFront = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + front + '.png');
          textureFront.wrapS = THREE.ClampToEdgeWrapping;
          textureFront.wrapT = THREE.ClampToEdgeWrapping;
          textureFront.magFilter = THREE.NearestFilter;
          textureFront.minFilter = THREE.LinearMipMapLinearFilter;
      var materialFront    = new THREE.MeshLambertMaterial( {map:textureFront, transparent: true} );
    }
    
    if (back) {
      var textureBack = THREE.ImageUtils.loadTexture('/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + back + '.png');
          textureBack.wrapS = THREE.ClampToEdgeWrapping;
          textureBack.wrapT = THREE.ClampToEdgeWrapping;
          textureBack.magFilter = THREE.NearestFilter;
          textureBack.minFilter = THREE.LinearMipMapLinearFilter;
      var materialBack    = new THREE.MeshLambertMaterial( {map:textureBack, transparent: true} );
    }
    
    if (left && !right && !top && !bottom && !front && !back) {
      return materialLeft;
    }
    else {
      return new Array(materialLeft,materialRight,materialTop,materialBottom,materialFront,materialBack);
    }
    
  }
  if (textureId == 1) {
    //grass
    return sides(4,4,1,3,4,4);
  }
  else if (textureId == 6) {
    //double slabs
    return sides(6,6,7,7,6,6);
  }
  else if (textureId == 9) {
    //tnt
    return sides(9,9,10,11,9,9);
  }
  else if (textureId == 22) {
    //wood
    return sides(21,21,22,22,21,21);
  }
  else if (textureId == 28) {
    //chest
    return sides(27,27,26,26,28,27);
  }
  else if (textureId == 36) {
    //bookshelf
    return sides(36,36,5,5,36,36);
  }
  else if (textureId == 44) {
    //crafting table
    return sides(60,60,44,44,61,61);
  }
  else if (textureId == 45) {
    //furnace
    return sides(46,46,63,63,45,46);
  }
  else if (textureId == 47) {
    //dispenser
    return sides(46,46,63,63,47,46);
  }
  else if (textureId == 69) {
    //snowy dirt
    return sides(69,69,67,3,69,69);
  }
  else if (textureId == 71) {
    //cactus
    return sides(71,71,70,72,71,71);
  }
  else if (textureId == 76) {
    //jukebox
    return sides(75,75,76,75,75,75);
  }
  else if (textureId == 103) {
    //pumpkin
    return sides(119,119,103,119,119,119);
  }
  else if (textureId == 107) {
    //stivky piston
    return sides(109,109,107,110,109,109);
  }
  else if (textureId == 108) {
    //piston
    return sides(109,109,108,110,109,109);
  }
  else if (textureId == 117) {
    //spruce
    return sides(117,117,22,22,117,117);
  }
  else if (textureId == 118) {
    //birch
    return sides(118,118,22,22,118,118);
  }
  else if (textureId == 120) {
    //jack o  lantern
    return sides(119,119,103,119,120,119);
  }
  else if (textureId == 137) {
    //melon
    return sides(137,137,138,138,137,137);
  }
  else if (textureId == 81) {
    material = sides(81);
    material.map.wrapS = THREE.RepeatWrapping;
    material.map.wrapT = THREE.RepeatWrapping;
    material.map.repeat.x = .125;
    material.map.repeat.y = .625;
    material.map.offset.x = -.5625;
    material.map.offset.y = .375;
    return material;
  }
  else {
    //wildcard
    return sides(textureId);
  }
}