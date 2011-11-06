(function ($) {
    $(document).ready(function(){

initiate3d();
animate();
line = drawGrid(scene, 0);

function initiate3d() {
    container = $('#mc-3d .canvas-wrapper');

    camera = new THREE.PerspectiveCamera( 45, 800 / 500, 1, 2000 );
    camera.position.set( 0, 200, 200 );

    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( $('#mc-3d .canvas-wrapper').innerWidth() , $('#mc-3d .canvas-wrapper').innerHeight() );

    $('#mc-3d .canvas-wrapper').append( renderer.domElement );
}

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
    if (textureId == 22) {
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
    if (textureId == 28) {
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

function addBlock(blocks,block) {
  for(var i=0; blocks[i]; i++) {
    if (block[0] == blocks[i][0]
        && block[1] == blocks[i][1]
        && block[2] == blocks[i][2]
        && block[3] == blocks[i][3]) {
        console.log('nothing to add');
        return blocks;
    }
    else if (block[0] == blocks[i][0]
            && block[1] == blocks[i][1]
            && block[2] == blocks[i][2]) {
        console.log('killing block..');
        scene.remove(blocks[i][4]);
        blocks.splice(i,1);
        break;
    }
  }
  if (block[3] !=  0) {
    size = 16;
    
    console.log('drawing block..');
    var CubeMaterial = blockTexture(block[3]);
    
    //create cube
    var Cube = new THREE.Mesh(
    new THREE.CubeGeometry(size,size,size,1,1,1,CubeMaterial), new THREE.MeshLambertMaterial());  
    //position
    Cube.position['y'] = (block[0]*size);
    Cube.position['x'] = (block[1]-8)*size+8;
    Cube.position['z'] = (block[2]-8)*-size-8;

    //draw
    scene.add(Cube);
    
    block.push(Cube);

    console.log('adding block..');
    blocks.push(block);

  }
    
  return blocks;
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


function add() {
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

function drawControls(Z, X, Y, blocks) {
/*      var exists = false;
    $('#structure-node-form .xy-grid .z-grid').each(function() {
    id = $(this).attr("id");
    zvalue = id.replace(/[^0-9.]/g, "");
    if (zvalue > Z) {
        console.log(((-zvalue+Z)*.2)+1);
        $(this).css('opacity', (((-zvalue+Z)*.1)+.5));
        $(this).css('z-index', (Z-zvalue)+1);
    }
    else if (zvalue < Z) {
        $(this).css('display', 'none');
        $(this).css('z-index', '-1');
    }
    else if (zvalue == Z) {
        exists = true;
        $(this).css('opacity', '1');
        $(this).css('display', 'block');
        $(this).css('z-index', '128');
    }
    });
    if (exists == false) {
    $('#structure-node-form .xy-grid').append('\n\
        <div class="z-grid" id="Z-grid-'+ Z + '"></div>');
    zcount = Z;
    xcount = X;
    ycount = Y;
    for (var i=0;i<=255;i++) {
        if(xcount >= X    && 
            xcount < X+16 &&
            ycount >= Y    && 
            ycount < Y+16) {
        $('#structure-node-form .xy-grid #Z-grid-'+ Z).append('\n\
            <div class="mc-block air" id="Z'+ zcount + '_X'+ xcount + '_Y' + ycount + '">\n\
        ');

        if (xcount < 15) {
            xcount++;
        }
        else if (ycount < 15) {
            xcount = '0';
            ycount ++;
        }
        else {
            xcount = '0';
            ycount = '0';
            zcount --;
        }
        }
        else{
        //i--;
        }
    }
    }


* 
*/
    
    
    if ($('#structure-node-form .xy-grid .mc-block').length == 0) {
    /*
        * Create 256 divs for each clickable block position
        */
    $('#structure-node-form .xy-grid').empty();
    zcount = Z;
    xcount = X;
    ycount = Y;
    for (var i=0;i<=255;i++) {
        $('#structure-node-form .xy-grid').append('\n\
        <div class="mc-block air" id="Z'+ zcount + '_X'+ xcount + '_Y' + ycount + '">\n\
        ');

        if (xcount < X+15) {
        xcount++;
        }
        else if (ycount < Y+15) {
        xcount = X;
        ycount ++;
        }
        else {
        xcount = X;
        ycount = Y;
        zcount --;
        }
    }
    }
    
    zcount = Z;
    xcount = X;
    ycount = Y;
    $('#structure-node-form .xy-grid .mc-block').each(function() {
        block = identifyBlock(this);
        $(this).attr('id', 'Z'+ zcount + '_X'+ xcount + '_Y' + ycount);
        
        if (xcount < X+15) {
        xcount++;
        }
        else if (ycount < Y+15) {
        xcount = X;
        ycount ++;
        }
        else {
        xcount = X;
        ycount = Y;
        zcount --;
        }
        
        $(this).removeAttr('style');
    });
    /*
        * apply approproate styling to corrosponding .mc-block
        */
    for (var i = 0; blocks[i]; i++) {
        if($('#Z'+ blocks[i][0] + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).length == 1){
            $('#Z'+ blocks[i][0] + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).attr('style', '\n\
            background-image: url(\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + blocks[i][3] + '.png\');\n\
            opacity: 1;\n\
        ');
        }
        else {
        for(var j = 0; j<4; j++) {
            if($('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).length == 1 &&
            (!($('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).attr('style')) ||
            ($('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).css('opacity')<(.5 - (j/10))))) {
                $('#Z'+ (Number(blocks[i][0])+j) + '_X'+ blocks[i][1] + '_Y' + blocks[i][2]).attr('style', '\n\
                background-image: url(\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + blocks[i][3] + '.png\');\n\
                opacity: ' + (.5 - (j/10)) + ' ;\n\
            ');
            break;
            }
        }
        }
    }
    

    
}

function identifyBlock(thisblock) {
    //isolate the coordinates
    id = $(thisblock).attr("id");
    coords = id.replace(/[^0-9-_.]/g, "");
    coords = coords.split("_");
    //console.log('Z:' + coords[0],' X:' + coords[1],' Y:' + coords[2]);
    return new Array (coords[0],coords[1],coords[2],$('input:radio[name=block_type]:checked').val());
}

function loadblocks(blockstr) {
    var blocks = new Array();

    //split up and loop through each block
    for (var i = 0, block; block = blockstr.split(",")[i]; i++) {

      //isolate the coordinates
      coords = block.split("][");
      coords = block.replace(/[^0-9.]/g, "");

      //isolate the block type
      blocktype = block.replace(/[^a-z.]/g, "");
    
      block = block.replace(/[[]/g, '');
      block = block.split(']');
      blocks[i] = block;
      
      console.log('drawing block..');
      size = 16;
    
      var CubeMaterial = blockTexture(block[3]);
    
      //create cube
      var Cube = new THREE.Mesh(
      new THREE.CubeGeometry(size,size,size,1,1,1,CubeMaterial), new THREE.MeshFaceMaterial());  
      //position
      Cube.position['y'] = (block[0]*size);
      Cube.position['x'] = (block[1]-8)*size+8;
      Cube.position['z'] = (block[2]-8)*-size-8;

      //draw
      scene.add(Cube);

      block[4] = Cube;
      
    }

    return blocks;
}

add(scene);

renderer.render(scene, camera);
/*
var mouseDown = 0;
document.body.onmousedown = function() { 
    mouseDown = 1;
}
document.body.onmouseup = function() {
    mouseDown = 0;
}
*/

var blocks = new Array;
var blockstr = $('#edit-field-structurearray-und-0-value').val();
$('#edit-field-structurearray-und-0-value').val('');
if (blockstr) {
    blocks = loadblocks(blockstr);
}

var currentZ = new Number;
var currentX = new Number;
var currentY = new Number;
var currentZoom = new Number;
currentZ = 0;
currentX = 0;
currentY = 0;
currentZoom = 0;
drawControls(currentZ, currentX, currentY, blocks);  
gridControl();

$('.up-z').click(function() {
    console.log('up');
    currentZ++;
    drawControls(currentZ, currentX, currentY, blocks);  
    line = drawGrid(scene, currentZ, line);
    gridControl();
    return false;
});

$('.down-z').click(function() {
    console.log('down');
    currentZ--;
    drawControls(currentZ, currentX, currentY, blocks);  
    line = drawGrid(scene, currentZ, line);
    gridControl();
    return false;
});

$('.north-y').click(function() {
    console.log('north');
    currentY--;
    drawControls(currentZ, currentX, currentY, blocks);  
    line = drawGrid(scene, currentZ, line);
    gridControl();
    return false;
});

$('.south-y').click(function() {
    console.log('south');
    currentY++;
    drawControls(currentZ, currentX, currentY, blocks);  
    line = drawGrid(scene, currentZ, line);
    gridControl();
    return false;
});

$('.east-x').click(function() {
    console.log('east');
    currentX++;
    drawControls(currentZ, currentX, currentY, blocks);  
    line = drawGrid(scene, currentZ, line);
    gridControl();
    return false;
});

$('.west-x').click(function() {
    console.log('west');
    currentX--;
    drawControls(currentZ, currentX, currentY, blocks);  
    line = drawGrid(scene, currentZ, line);
    gridControl();
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
    $(".ui-selected", this).each(function(){
        $(this).css('background-image', 'url(' + '\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + $('input:radio[name=block_type]:checked').val() + '.png\')');
        $(this).css('opacity', '1');
        type = $('input:radio[name=block_type]:checked').val();
        $(this).attr('class', 'mc-block '+ type);
        var block = identifyBlock(this);
        blocks = addBlock(blocks,block);
        return blocks;
    });
    }
});
function gridControl() {
    /*
    $('#structure-node-form .xy-grid .mc-block').click(function() {
    type = $('input:radio[name=block_type]:checked').val();
    $(this).attr('class', 'mc-block '+ type);
    var block = identifyBlock(this);
    blocks = addBlock(scene,blocks,block);
    $(this).css('background-image', 'url(' + '\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + $('input:radio[name=block_type]:checked').val() + '.png\')');
    $(this).css('opacity', '1');
    })
    $('#structure-node-form .xy-grid .mc-block').hover(function() {
    if (mouseDown) {
        type = $('input:radio[name=block_type]:checked').val();
        $(this).attr('class', 'mc-block '+ type);
        var block = identifyBlock(this);
        blocks = addBlock(scene,blocks,block);
        $(this).css('background-image', 'url(' + '\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + $('input:radio[name=block_type]:checked').val() + '.png\')');
        $(this).css('opacity', '1');
    }
    });
    */
}  
    });
})(jQuery); 