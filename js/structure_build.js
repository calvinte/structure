(function ($) {
    $(document).ready(function(){

initiate3d();
animate();
line = drawGrid(scene, 0);

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

function drawControls(Z, X, Y, blocks) {
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
    }
    return blocks;
}

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
    gridControl();
    return false;
});

$('.down-z').click(function() {
    console.log('down');
    currentZ--;
    drawControls(currentZ, currentX, currentY, blocks);  
    gridControl();
    return false;
});

$('.north-y').click(function() {
    console.log('north');
    currentY--;
    drawControls(currentZ, currentX, currentY, blocks);  
    gridControl();
    return false;
});

$('.south-y').click(function() {
    console.log('south');
    currentY++;
    drawControls(currentZ, currentX, currentY, blocks);  
    gridControl();
    return false;
});

$('.east-x').click(function() {
    console.log('east');
    currentX++;
    drawControls(currentZ, currentX, currentY, blocks);  
    gridControl();
    return false;
});

$('.west-x').click(function() {
    console.log('west');
    currentX--;
    drawControls(currentZ, currentX, currentY, blocks);  
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