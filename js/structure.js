blocks = new Array();
var currentZ = new Number;
var currentX = new Number;
var currentY = new Number;
var ready = new Boolean;
ready = false;

window.onload=function(){
  blocks = loadBlocks();
  console.log(Drupal.settings.structureMode == 'edit');
  if (Drupal.settings.structureMode == 'edit') {
    structureBuild();
  }
  drawBlocks(blocks);
  enable3d = true;
}
 /* Provide blocks as array from document as string. This function will
  * be used to deserialize blocks data from the database
  * 
  * @return blocks as array
  */
  function loadBlocks() {
    var blocks = new Array();

    // load blocks from page element
    var blockstr = Drupal.settings.structureArray;

    // if element provided data..
    if (blockstr) {
     /* Split up blockstr and loop through creating our
      * multi-dimensional blocks array
      */
      for (var i = 0, block; block = blockstr.split(",")[i]; i++) {
        block = block.replace(/[[]/g, '');
        block = block.split(']');
        blocks[i] = block;
      }
    }

    return blocks;
  }

function structureBuild() {
  (function ($) {
    $(document).ready(function(){

     /* Add array block to array blocks
      * 
      * @param blocks as array
      * @param block as array
      * @return blocks as array
      */
      function addBlock(blocks,block) {

        for(var i=0; blocks[i]; i++) {
         /* 
          * First run through all items in blocks array and 
          * make sure that block is unique
          */
          if (block[0] == blocks[i][0]
            && block[1] == blocks[i][1]
            && block[2] == blocks[i][2]
            && block[3] == blocks[i][3]) {
            //console.log('nothing to add');
            return blocks;
          }
         /* 
          * if block is unique make sure that there aren't any other blocks
          * with the same coordinates, if there are remove them
          */
          else if (block[0] == blocks[i][0]
              && block[1] == blocks[i][1]
              && block[2] == blocks[i][2]) {
            //console.log('killing block..');
            if (enable3d) {
              killBlock(blocks[i][4]);
            }
            blocks.splice(i,1);
            break;
          }
        }

       /*
        * ensure that the block we're about to add isn't a 0 block (air)
        */
        if (block[3] !=  0) {
          //console.log('adding block..');
          blocks.push(block);
        }
        return blocks;
      }

     /* Draw user interface controls on the screen
      * 
      * @param current Z position as number
      * @param current X position as number
      * @param current Y position as number
      * @param blocks as array
      */
      function drawControls(Z, X, Y, blocks) {
        //console.log('drawing controls');
       /* If there aren't any .xy-grid .mc-block elements then it's our first
        * time through, create them
        */
        if ($('#structure-node-form .xy-grid .mc-block').length == 0) {
          zcount = Z;xcount = X;ycount = Y;
          for (var i=0;i<=255;i++) {
            $('#structure-node-form .xy-grid').append('<div class="mc-block air" id="Z'+ zcount + '_X'+ xcount + '_Y' + ycount + '">');
            if (xcount < X+15) { xcount++; }
            else if (ycount < Y+15) { xcount = X;ycount ++; }
            else { xcount = X;ycount = Y;zcount --; }
          }
        }

       // Identify each .xy-grid .mc-block element and remove style attribute
        zcount = Z;xcount = X;ycount = Y;
        $('#structure-node-form .xy-grid .mc-block').each(function() {
          $(this).attr('id', 'Z'+ zcount + '_X'+ xcount + '_Y' + ycount);

          if (xcount < X+15) { xcount++; }
          else if (ycount < Y+15) { xcount = X; ycount ++; }
          else { xcount = X; ycount = Y; zcount --; }

          $(this).removeAttr('style');
        });

       // loop through blocks and style .xy-grid .mc-blocks
        for (var i = 0; blocks[i]; i++) {
           // If there is a matching .xy-grid .mc-blocks element style it
            if($('#Z'+ blocks[i][0] + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).length == 1){
              $('#Z'+ blocks[i][0] + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).attr('style', '\n\
              background-image: url(\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + blocks[i][3] + '.png\');\n\
              opacity: 1;');
            }
           /* if there is not a matching .xy-grid .mc-blocks element, see if
            * there is a matching element on a lower Z-level and draw it in 
            * with a slightly lesser opacity
            */
            else {
            for(var j = 0; j<4; j++) {
                if  ($('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).length == 1 &&
                  (!($('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).attr('style')) ||
                    ($('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).css('opacity')<(.5 - (j/10))))) {
                    $('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).attr('style', '\n\
                  background-image: url(\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + blocks[i][3] + '.png\');\n\
                  opacity: ' + (.5 - (j/10)) + ' ;');
                break;
              }
            }
          }
        }
      }

     /* Provide .xy-grid .mc-block element and return it as block array
      * 
      * @param thisblock as HTML element
      * @return new Array as structured block (X,Y,Z,TYPE)
      */
      function identifyBlock(thisblock) {
        //isolate the coordinates
        id = $(thisblock).attr("id");
        coords = id.replace(/[^0-9-_.]/g, "");
        coords = coords.split("_");
        return new Array (coords[0],coords[1],coords[2],$('input:radio[name=block_type]:checked').val());
      }

      var currentZ = new Number;
      var currentX = new Number;
      var currentY = new Number;
      drawControls(currentZ, currentX, currentY, blocks);
      var enable3d = new Boolean;

      $('.up-z').click(function() {
        console.log('up');
        currentZ++;
        drawControls(currentZ, currentX, currentY, blocks); 
        if (enable3d) {
          line = drawGrid(scene, currentZ, line);
        }
        return false;
      });

      $('.down-z').click(function() {
        console.log('down');
        currentZ--;
        drawControls(currentZ, currentX, currentY, blocks);  
        if (enable3d) {
          line = drawGrid(scene, currentZ, line);
        } 
        return false;
      });

      $('.north-y').click(function() {
        console.log('north');
        currentY--;
        drawControls(currentZ, currentX, currentY, blocks);  
        return false;
      });

      $('.south-y').click(function() {
        console.log('south');
        currentY++;
        drawControls(currentZ, currentX, currentY, blocks);  
        return false;
      });

      $('.east-x').click(function() {
        console.log('east');
        currentX++;
        drawControls(currentZ, currentX, currentY, blocks);  
        return false;
      });

      $('.west-x').click(function() {
        console.log('west');
        currentX--;
        drawControls(currentZ, currentX, currentY, blocks);  
        return false;
      });

      $('#edit-submit').click(function() {
        var blockstr = new String;
        $('#edit-field-structurearray-und-0-value').val('');
        for (var i = 0, block; block = blocks[i]; i++) {
          for (var j = 0; block[j]; j++) {
            block[j] = '[' + block[j] + ']';
          }
        blockstr += block.slice(0,4).toString().replace(/,/g, '') + ',';
        }
        $('#edit-field-structurearray-und-0-value').val(blockstr);
      });

      var startTime = new Date();
      var endTime = new Date();

      $('#structure-node-form .xy-grid').selectable({
        /*
        selecting: function(event, ui){ 
        $(".ui-selecting", this).each(function(){
            $(this).css('background-image', 'url(' + '\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + $('input:radio[name=block_type]:checked').val() + '.png\')');
            $(this).css('opacity', '1');
        });
        },
        */
        selected: function(event, ui){ 
          startTime = new Date().getTime();
          $(".ui-selected", this).each(function(){
            block = identifyBlock(this);
            type = $('input:radio[name=block_type]:checked').val();
            $(this).attr('class', 'mc-block '+ type);
            blocks = addBlock(blocks,block);
            if (enable3d) {
              drawBlock(block);
            }
            return blocks;
          });
        },

        stop: function(event, ui){
          drawControls(currentZ, currentX, currentY, blocks);
          endTime = new Date().getTime();
          console.log('Execution time: ' + (Number(endTime) - Number(startTime)));
        }
      });

    });
  })(jQuery); 
}


//structure3d
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

function drawBlocks(blocks) {
  for(var i=0; blocks[i]; i++) {
    drawBlock(blocks[i], scene);
  }
}

function killBlock(Cube) {
  scene.remove(Cube);
}
