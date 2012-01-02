/* Initiate Webd GL / Three.JS
 */
function initiate3d() {
  (function ($) {
    $(document).ready(function(){
      startTime = new Date().getTime();
      
      initiated = false;
      
      container = $('#mc-3d .canvas-wrapper');
      container.empty();

      scene = new THREE.Scene();

      camera = new THREE.PerspectiveCamera( 45, container.innerWidth()/container.innerHeight(), .001, 20000 );
      camera.position.set( 0, 200, 200 );
      
      //controls = new THREE.FirstPersonControls(camera);
      
      //controls.movementSpeed = 100;
      //controls.lookSpeed = 0.125;
      //controls.noFly = true;
      //controls.lookVertical = false;
      
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
      xsize = schematic.getSizeX();
      ysize = schematic.getSizeY();
      zsize = schematic.getSizeZ();
      blocksLength = xsize*ysize*zsize;
      var xcount = 0;
      var ycount = 0;
      var zcount = 0;
      geometryMesh = new Array();
      geometryMerge = new Array();
      
      for(var i=0; i<blocksLength; i++) {
        blockId = schematic.getBlockId(xcount,ycount,zcount);
        drawBlock(Array(xcount,ycount,zcount,blockId,0));
        xcount < xsize ? xcount++ : newLine();
      }
      function newLine(){
        if (zcount < zsize) {
          xcount = 0;
          zcount ++;
        }
        else return newLayer();
      }
      function newLayer(){
        xcount = 0;
        zcount = 0;
        ycount++
      }
      
      for(var i=0; i<geometryMesh.length; i++) {
        if (geometryMesh[i]) scene.add(geometryMesh[i]);
      }
      
      initiated = true;
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
  var grid_material = new THREE.LineBasicMaterial( {color: 0x000000, opacity: 0.2} ),
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
  
  function generateMaterials(leftSide,rightSide,topSide,bottomSide,frontSide,backSide) {
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
      texture.offset.x = sides[i][0]/16;
      texture.offset.y = sides[i][1]/16;
      materials.push(new THREE.MeshLambertMaterial( {map:texture, transparent: true} ));
    }
    return materials;
  }
  
  if (block[3] !=  0) {
    size = 16;
    
    BlockOffset = new Array(0,0,0);
    BlockGeometry = new Array(16,16,16);
  
    switch (block[3]) {    

      case 2: //Grass
        BlockMaterial =  generateMaterials(
          leftSide =   Array(3,0),
          rightSide =  Array(3,0),
          topSide =    Array(0,0),
          bottomSide = Array(2,0),
          frontSide =  Array(3,0),
          backSide =   Array(3,0));
        break;

      case 17: //Wood
        BlockMaterial =  generateMaterials(
          leftSide =   Array(4,1),
          rightSide =  Array(4,1),
          topSide =    Array(5,1),
          bottomSide = Array(5,1),
          frontSide =  Array(4,1),
          backSide =   Array(4,1));
        break;

      //case 17:1: //Wood (Pine)
        BlockMaterial =  generateMaterials(
          leftSide =   Array(4,7),
          rightSide =  Array(4,7),
          topSide =    Array(5,1),
          bottomSide = Array(5,1),
          frontSide =  Array(4,7),
          backSide =   Array(4,7));
        break;

      //case 17:2: //Wood (Birch)
        BlockMaterial =  generateMaterials(
          leftSide =   Array(5,7),
          rightSide =  Array(5,7),
          topSide =    Array(5,1),
          bottomSide = Array(5,1),
          frontSide =  Array(5,7),
          backSide =   Array(5,7));
        break

      case 23: //Dispenser
        BlockMaterial =  generateMaterials(
          leftSide =   Array(13,2),
          rightSide =  Array(13,2),
          topSide =    Array(14,3),
          bottomSide = Array(14,3),
          frontSide =  Array(14,2),
          backSide =   Array(13,2));
        break;

      case 26: //bed
        materials   = generateMaterials(
          frontSide  = Array(8,10),
          backSide   = Array(5,10),
          topSide    = Array(6,8),
          bottomSide = Array(8,8),
          leftSide   = Array(6,9),
          rightSide  = Array(8,9));

        materials[0].map.offset.y -= 9/256;
        materials[0].map.repeat.y = 9/256;

        materials[1].map.offset.y -= 9/256;
        materials[1].map.repeat.y =  9/256;

        materials[2].map.repeat.x = 32/256;

        materials[3].map.repeat.x = -32/256;

        materials[4].map.repeat.x =  32/256;
        materials[4].map.repeat.y =  9/256;
        materials[4].map.offset.y += 7/256;

        materials[5].map.repeat.x =  -32/256;
        materials[5].map.repeat.y =  9/256;
        materials[5].map.offset.y += 7/256;
        BlockMaterial =  materials;
        
        switch (block[4]) {
          case 0:
            BlockOffset[0] = 3;
            BlockOffset[2] = -8;
            break;
          case 1:
            BlockOffset[0] = 3;
            BlockOffset[1] = -8;
            break;
          case 2:
            BlockOffset[0] = 3;
            BlockOffset[2] = +8;
            break;
          case 3:
            BlockOffset[0] = 3;
            BlockOffset[1] = +8;
            break;
        }
        
        BlockGeometry = new Array(32,6,16);
        break;

      case 29: //Sticky Piston
        BlockMaterial =  generateMaterials(
          leftSide =   Array(12,6),
          rightSide =  Array(12,6),
          topSide =    Array(10,6),
          bottomSide = Array(13,6),
          frontSide =  Array(12,6),
          backSide =   Array(12,6));
        break;

      case 33: //Piston
        BlockMaterial =  generateMaterials(
          leftSide =   Array(12,6),
          rightSide =  Array(12,6),
          topSide =    Array(11,6),
          bottomSide = Array(13,6),
          frontSide =  Array(12,6),
          backSide =   Array(12,6));
        break;

      case 46: //TNT
        BlockMaterial =  generateMaterials(
          leftSide =   Array(8, 0),
          rightSide =  Array(8, 0),
          topSide =    Array(9, 0),
          bottomSide = Array(10,0),
          frontSide =  Array(8, 0),
          backSide =   Array(8, 0));
        break;

      case 47: //Bookshelf
        BlockMaterial =  generateMaterials(
          leftSide =   Array(3,2),
          rightSide =  Array(3,2),
          topSide =    Array(4,0),
          bottomSide = Array(4,0),
          frontSide =  Array(3,2),
          backSide =   Array(3,2));
        break;
      
      case 50: //torch 
        material = generateMaterials(spritePosition(block[3]));
        material.map.offset.x /= 16;
        material.map.offset.y /= 16;
        material.map.repeat.x = 2/256;
        material.map.repeat.y = 14/256;
        material.map.offset.x += 7/256;
        BlockMaterial =  material;
        BlockGeometry = new Array(2,16,2);
        break
      
      case 54: //Chest
        BlockMaterial =  generateMaterials(
          leftSide =   Array(10,1),
          rightSide =  Array(10,1),
          topSide =    Array(9, 1),
          bottomSide = Array(9, 1),
          frontSide =  Array(11,1),
          backSide =   Array(10,1));
        break;

      case 58: //Crafting Table
        BlockMaterial =  generateMaterials(
          leftSide =   Array(11,3),
          rightSide =  Array(12,3),
          topSide =    Array(11,2),
          bottomSide = Array(11,2),
          frontSide =  Array(11,3),
          backSide =   Array(12,3));
        break;

      case 61: //Furnace
        BlockMaterial =  generateMaterials(
          leftSide =   Array(13,2),
          rightSide =  Array(13,2),
          topSide =    Array(14,3),
          bottomSide = Array(14,3),
          frontSide =  Array(12,2),
          backSide =   Array(13,2));
        break;

      case 62: //Furnace (Smelting)
        BlockMaterial =  generateMaterials(
          leftSide =   Array(13,2),
          rightSide =  Array(13,2),
          topSide =    Array(14,3),
          bottomSide = Array(14,3),
          frontSide =  Array(13,3),
          backSide =   Array(13,2));
        break;

      case 81: //Cactus
        BlockMaterial =  generateMaterials(
          leftSide =   Array(6,4),
          rightSide =  Array(6,4),
          topSide =    Array(5,4),
          bottomSide = Array(5,4),
          frontSide =  Array(6,4),
          backSide =   Array(6,4));
        break;

      case 84: //Jukebox
        BlockMaterial =  generateMaterials(
          leftSide =   Array(10,4),
          rightSide =  Array(10,4),
          topSide =    Array(11,4),
          bottomSide = Array(10,4),
          frontSide =  Array(10,4),
          backSide =   Array(10,4));
        break;

      case 86: //Pumpkin
        BlockMaterial = generateMaterials(
            leftSide    = Array(6,7),
            rightSide   = Array(6,7),
            topSide     = Array(6,6),
            bottomSide  = Array(6,7),
            frontSide   = Array(7,7),
            backSide    = Array(6,7));
        break;

      case 91: //Jack-o-Lantern
        BlockMaterial =  generateMaterials(
          leftSide =   Array(6,7),
          rightSide =  Array(6,7),
          topSide =    Array(6,6),
          bottomSide = Array(6,7),
          frontSide =  Array(8,7),
          backSide =   Array(6,7));
        break;

      case 92: //Cake (Block)
        BlockMaterial =  generateMaterials(
          leftSide =   Array(10,7),
          rightSide =  Array(10,7),
          topSide =    Array(9, 7),
          bottomSide = Array(11,7),
          frontSide =  Array(10,7),
          backSide =   Array(10,7));
        break;

      case 103: //Melon (Block)
        BlockMaterial =  generateMaterials(
          leftSide =   Array(8,8),
          rightSide =  Array(8,8),
          topSide =    Array(9,8),
          bottomSide = Array(8,8),
          frontSide =  Array(8,8),
          backSide =   Array(8,8));
        break;

      default: //wildcard
        material = generateMaterials(spritePosition(block[3]));
        material.map.offset.x /= 16;
        material.map.offset.y /= 16;
        BlockMaterial =  material;
        BlockGeometry = new Array(16,16,16);
    }
    
    var Cube = new THREE.Mesh(
      new THREE.CubeGeometry(
        BlockGeometry[0],
        BlockGeometry[1],
        BlockGeometry[2],
        1,1,1
      )
    );

    Cube.position.y -= BlockOffset[0];
    Cube.position.x -= BlockOffset[1];
    Cube.position.z -= BlockOffset[2];
    
    //position
    Cube.position['x'] += (block[0]-7.5)*size;
    Cube.position['z'] += (block[2]-7.5)*size;
    Cube.position['y'] += block[1]*size;
    
    //rotation
    Cube.rotation['y'] = ((block[4]*90)-90)*(Math.PI / 180);
  
    if (!geometryMerge[block[3]]) geometryMerge[block[3]] = new THREE.Geometry();
    if (geometryMesh[block[3]]) scene.remove(geometryMesh[block[3]]);
    
    THREE.GeometryUtils.merge(geometryMerge[block[3]], Cube);
    
    geometryMesh[block[3]] = new THREE.Mesh(geometryMerge[block[3]], BlockMaterial);

    if (initiated) scene.add(geometryMesh[block[3]]);

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
  //controls.update();
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