window["com"] = {mordritch: {mcSim:{}}};
var currentVersion = 1;
var enable3d = false;
var startTime = new Date();
var endTime = new Date();

(function ($) {
  $(document).ready(function(){

    if (Drupal.settings.structureArray)
      loadNbtBlocks(base64_decode(Drupal.settings.structureArray));
    else {
      window["schematic"] = new com.mordritch.mcSim.World_Schematic();
      schematic.makeNew(16,1,16);
    }

    $('a.enable-3d').click(function() {
      initiate3d();
      enable3d = true;
      return false;
    });

    if (Drupal.settings.structureMode == 'edit') {
      structureBuild();
    }
  });

  // when file is uploaded
  $(document).ajaxComplete(function(){
    // see if the file exists
    if (Drupal.settings.schematicFile) {
      loadNbtBlocks(base64_decode(Drupal.settings.schematicFile));
      if (enable3d) three.addSchematicToScene();
    }
    else {
      // decode the uploaded file
      loadNbtBlocks(base64_decode(Drupal.settings.structureArray));
    }
  });

})(jQuery);

/**
 * Provide schematic object via Jonathan Lydall's JsNbtParser
 *
 * @param data as binary
 */
function loadNbtBlocks(data) {
  window["nbtData"] = new com.mordritch.mcSim.NbtParser().decode(data);
  window["schematic"] = new com.mordritch.mcSim.World_Schematic(window["nbtData"]);
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
    blockstr = blockstr.split(",");
    for (var i = 0, block; block = blockstr[i]; i++) {
      block = block.replace(/[[]/g, '');
      block = block.split(']');
      blocks[i] = block;
    }

    //check version
    blocks = updateBlocks(blocks);

  }

  return blocks;
}


function structureBuild() {
  var controlsExist = false;
  var currentZ = 0;
  var currentX = 0;
  var currentY = 0;
  var rotation = 0;
  (function ($) {
    $(document).ready(function(){
      drawControls(currentZ, currentX, currentY);

      $('.up-z').click(function() {
        console.log('up');
        currentY++;
        drawControls(currentZ, currentX, currentY);
        //if (enable3d) grid = drawGrid(scene, currentZ, grid);
        return false;
      });

      $('.down-z').click(function() {
        console.log('down');
        currentY--;
        drawControls(currentZ, currentX, currentY);
        //if (enable3d) grid = drawGrid(scene, currentZ, grid);
        return false;
      });

      $('.north-y').click(function() {
        console.log('north');
        currentZ--;
        drawControls(currentZ, currentX, currentY);
        return false;
      });

      $('.south-y').click(function() {
        console.log('south');
        currentZ++;
        drawControls(currentZ, currentX, currentY);
        return false;
      });

      $('.east-x').click(function() {
        console.log('east');
        currentX++;
        drawControls(currentZ, currentX, currentY);
        return false;
      });

      $('.west-x').click(function() {
        console.log('west');
        currentX--;
        drawControls(currentZ, currentX, currentY);
        return false;
      });

      $('#edit-block-type input').next().append('<span class="block-rotation"><a href="#rotate" class="block-rotate rotation-' + rotation + '">Rotation ' + rotationSymbol(rotation) + '</a></span>');
      $('#edit-block-type input').parent().find('.block-rotation').hide();
      $('#edit-block-type input:checked').parent().find('.block-rotation').show();

      $('#edit-block-type').change(function(){
        $('#edit-block-type input').parent().find('.block-rotation').hide();
        $('#edit-block-type input:checked').parent().find('.block-rotation').show();
      });

      $('a.block-rotate').click(function(){
        if (rotation < 3) {rotation++}
        else {rotation = 0;}
        $('#edit-block-type .block-rotate').attr('class', 'block-rotate rotation-' + rotation);
        $('#edit-block-type .block-rotate').text('Rotation ' + rotationSymbol(rotation));
        return false;
      });

      $('#structure-node-form').submit(function() {
        window["nbtData"] = new com.mordritch.mcSim.NbtParser().encode(schematic.schematic);
        window["nbtData"] = base64_encode(window["nbtData"]);
        $('#edit-field-structurearray-und-0-value').val('');
        $('#edit-field-structurearray-und-0-value').val(nbtData);
        alert($('#edit-field-structurearray-und-0-value').val());
        return true;
      });

      $('#structure-node-form .xy-grid').selectable({

        selecting: function(event, ui){
          $(".ui-selecting:not(.ui-unselecting)", this).each(function(){
              if($(this).attr('style')){
                $(this).attr('oldstyle', $(this).attr('style'));
              }
              backgroundPosition = spritePosition(Number($('input:radio[name=block_type]:checked').val()));
              $(this).attr('style', blockStyle('mc-sprite.png',backgroundPosition[0],backgroundPosition[1],1));
              $(this).addClass('ui-unselecting');
          });
        },

        unselecting: function(event, ui){
          $(".ui-unselecting:not(.ui-selecting)", this).each(function(){
            if ($(this).attr('oldstyle')) {
              $(this).attr('style', $(this).attr('oldstyle'));
            }
            else {
              $(this).removeAttr('style');
            }
            $(this).removeAttr('oldstyle');
            $(this).removeClass('ui-unselecting');
          });
        },

        stop: function(event, ui){
          var offsetX = 0;
          var offsetY = 0;
          var offsetZ = 0;
          var blocks = new Array();
          $(".ui-selected", this).each(function(){
            $(this).removeAttr('oldstyle');
            $(this).removeClass('ui-unselecting');
            type = $('input:radio[name=block_type]:checked').val();
            $(this).attr('class', 'mc-block '+ type);
            var block = identifyBlock(this);

            schematic.forceSetBlockAndMetadata(
              block[0] + offsetX,
              block[1] + offsetY,
              block[2] + offsetZ,
              block[3]
            );

            // Because forceSetBlockAndMetadata() changed the dimensions of
            // the schematics on the fly we need to account for that
            if ( block[0] < 0 && block[0] * -1 > offsetX ) offsetX = block[0] * -1;
            if ( block[1] < 0 && block[1] * -1 > offsetY ) offsetY = block[1] * -1;
            if ( block[2] < 0 && block[2] * -1 > offsetZ ) offsetZ = block[2] * -1;

            // If 3d is enabled, draw the block on the canvas
            if (enable3d) blocks[$(this).attr('id')] = new Object({
              x : block[0] + offsetX,
              y : block[1] + offsetY,
              z : block[2] + offsetZ
            });
          });

          if (enable3d) three.addBlocksToScene(blocks);
          // Change the currentX to match the new schematic position
          //  before we run drawControls()
          currentX += offsetX;
          currentY += offsetY;
          currentZ += offsetZ;
          drawControls(currentZ, currentX, currentY);

          // If the schematic has been offset we need to redraw
          // the entire schematic
          // @TODO optimize this
          if (offsetX || offsetY || offsetZ) {
            if (enable3d) three.addSchematicToScene();
          }

        }
      });

      /* Small helper function to determine which arrow symobl to print
       *
       * @param rotation
       *
       * @return string as either ↑, →, ↓ or ←
       */
      function rotationSymbol(rotation) {
             if (rotation == '0') symbol = '\u2191';
        else if (rotation == '1') symbol = '\u2192';
        else if (rotation == '2') symbol = '\u2193';
        else symbol = '\u2190';
        return symbol;
      }

      /**
       * Draws user interface for adding blocks on the screen
       *
       * @param Z representing current Z coordinate
       * @param X representing current X coordinate
       * @param Y representing current Y coordinate
       */
      function drawControls(Z, X, Y) {
        // If there aren't any .xy-grid .mc-block elements then it's our first
        // time through, create them
        if (!controlsExist) {
          zcount=Z;xcount=X;ycount=Y;
          for (var i=0;i<=255;i++) {
            $('#structure-node-form .xy-grid').append('<div class="mc-block air" id="Z' + zcount + '_X'+ xcount + '_Y'+ ycount + '">');
            xcount < X+15 ? xcount++ : newLine();
          }
          controlsExist = true;
        }

        // re-declare our z/x/y counters
        zcount=Z;xcount=X;ycount=Y;
        // loop through all control elements
        $('#structure-node-form .xy-grid .mc-block').each(function() {

          $(this).removeAttr('style'); //remove old styling
          blockId = schematic.getBlockId(xcount,ycount,zcount); //get the blockId

          if (blockId != 0) {
            // add a style element to the .mc-block
            backgroundPosition = spritePosition(blockId);
            $(this).attr('style', blockStyle('mc-sprite.png',backgroundPosition[0],backgroundPosition[1],1));
          }
          else {
            // if there is not a matching .block, see if there is a matching
            // block on a lower level
            for(var j = 1; j<5; j++) {
              blockId = schematic.getBlockId(xcount,ycount-j,zcount);
              if  (blockId) {
                backgroundPosition = spritePosition(blockId);
                opacity = .5 - (j/10);
                $(this).attr('style', blockStyle('mc-sprite.png',backgroundPosition[0],backgroundPosition[1],opacity));
                break; //don't continue looking for lower
              }
            }
          }

          $(this).attr('id', 'X'+ xcount + '_Y'+ ycount + '_Z' + zcount);
          xcount < X+15 ? xcount++ : newLine();
        });
        function newLine(){xcount = X;zcount ++;}
      }

      /**
       * Provides CSS used to style .mc-block elements
       *
       * @param image as string representing pafrom module
       * @param x representing offset from left of image
       * @param y representing offset from left of image
       * @param opacity as decimal
       *
       */
      function blockStyle(image,x,y,opacity) {
        return '\n\
        background-image: url(' + '\'/' + Drupal.settings.structurePath + '/' + image + '\');\n\
        background-position: -' + x + 'px -' + y + 'px;\n\
        opacity: ' + opacity + ';\n\
        background-color: #090;';
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
        return new Array (
            Number(coords[0]),
            Number(coords[1]),
            Number(coords[2]),
            Number($('input:radio[name=block_type]:checked').val()),
            rotation);
      }

    });
  })(jQuery);
}

function spritePosition(blockid) {
  x = new Number;
  y = new Number;
  switch (blockid) {
    case 0: //air
      break;
    case 1: //stone
      x = '1';
      y = '0';
      break;
    case 2: //grass
      x = '0';
      y = '0';
      break;
    case 3: //dirt
      x = '2';
      y = '0';
      break;
      y = '1';
      break;
    case 5: //wooden plank
      x = '4';
      y = '0';
      break;
    case 6: //sapling
      x = '15';
      y = '1';
      break;
    //case 6:1: //sapling(pine)
      x = '15';
      y = '4';
      break;
    //case 6:2: //sapling(birch)
      x = '15';
      y = '5';
      break;
    case 7: //bedrock
      x = '1';
      y = '1';
      break;
    case 8: //water (no spread)
      break;
    case 9: //water
      x = '14';
      y = '13';
      break;
    case 10: //lava
      break;
    case 11: //lava (no spread)
      x = '13';
      y = '14';
      break;
    case 12: //sand
      x = '2';
      y = '1';
      break;
    case 13: //gravel
      x = '3';
      y = '1';
      break;
    case 14: //gold ore
      x = '0';
      y = '2';
      break;
    case 15: //iron ore
      x = '1';
      y = '2';
      break;
    case 16: //coal ore
      x = '2';
      y = '2';
      break;
    case 17: //wood
      x = '4';
      y = '1';
      break;
    //case 17:1: //wood (pine)
      x = '4';
      y = '7';
      break;
    //case 17:2: //wood (birch)
      x = '5';
      y = '7';
      break;
    case 18: //leaves
      x = '5';
      y = '8';
      break;
    //case 18:1: //leaves (pine)
      x = '5';
      y = '8';
      break;
    //case 18:2: // leaves (birch)
      x = '5';
      y = '8';
      break;
    case 19: //sponge
      x = '0';
      y = '3';
      break;
    case 20: //glass
      x = '1';
      y = '3';
      break;
    case 21: //lapis lazuli ore
      x = '0';
      y = '10';
      break;
    case 22: //lapis lazuli block
      x = '0';
      y = '9';
      break;
    case 23: //dispenser
      x = '14';
      y = '2';
      break;
    case 24: //sandstone
      x = '0';
      y = '12';
      break;
    case 25: //note block
      x = '10';
      y = '4';
      break;
    case 26: //bed
      x = '6';
      y = '8';
      break;
    case 27: //powered rail
      x = '3';
      y = '10';
      break;
    case 28: //detector rail
      x = '3';
      y = '12';
      break;
    case 29: // sticky piston
      x = '10';
      y = '6';
      break;
    case 30: //web
      x = '0';
      y = '11';
      break;
    case 31: //Tall Grass (Dead Shrub)
      break;
    //case 31:1: // Tall Grass
      break;
    //case 31:2: //Tall Grass (Fern)
      break;
    case 32: //Dead Shrub
      x = '7';
      y = '3';
      break;
    case 33: //Piston
      x = '11';
      y = '6';
      break;
    case 34: //Piston (Head)
      x = '10';
      y = '6';
      break;
    case 35: //wool
      x = '0';
      y = '4';
      break;
    ///case 35:1: //orange wool
      x = '2';
      y = '13';
      break;
    //case 35:2: //magenta wool
      x = '2';
      y = '12';
      break;
    //case 35:3: //light blue wool
      x = '2';
      y = '11';
      break;
    //case 35:4: //yellow wool
      x = '2';
      y = '10';
      break;
    //case 35:5: //lime wool
      x = '2';
      y = '9';
      break;
    //case 35:6: // pink wool
      x = '1';
      y = '8';
      break;
    //case 35:7: //grey wool
      x = '1';
      y = '7';
      break;
    //case 35:8: //light grey wool
      x = '1';
      y = '14';
      break;
    //case 35:9: //cyan wool
      x = '1';
      y = '13';
      break;
    //case 35:10: //purple wool
      x = '1';
      y = '12';
      break;
    //case 35:11: //blue wool
      x = '1';
      y = '11';
      break;
    //case 35:12: //brown wool
      x = '1';
      y = '10';
      break;
    //case 35:13: //green wool
      x = '1';
      y = '9';
      break;
    //case 35:14: //red wool
      x = '0';
      y = '8';
      break;
    //case 35:15: //black wool
      x = '0';
      y = '7';
      break;
    case 36: //unknown
      break;
    case 37: //dandelion
      x = '13';
      y = '0';
      break;
    case 38: //rose
      x = '12';
      y = '0';
      break;
    case 39: //brown mushroom
      x = '13';
      y = '1';
      break;
    case 40: //red mushroom
      x = '12';
      y = '1';
      break;
    case 41: //block of gold
      x = '7';
      y = '1';
      break;
    case 42: //block of iron
      x = '6';
      y = '1';
      break;
    case 43: //stone slab (double)
      x = '5';
      y = '0';
      break;
    //case 43:1: //sandstone slab (double)
      x = '0';
      y = '12';
      break;
    //case 43:2: //wooden slab (double)
      x = '4';
      y = '0';
      break;
    //case 43:3: //cobblestone  slab (double)
      x = '0';
      y = '1';
      break;
   // case 43:4: //brick slab (double)
      x = '8';
      y = '0';
      break;
    //case 43:5: //stone brick slab (double)
      x = '6';
      y = '3';
      break;
    //case 44: //stone slab
      x = '5';
      y = '0';
      break;
    //case 44:1: //sandstone slab
      x = '0';
      y = '12';
      break;
    //case 44:2: //wooden slab
      x = '4';
      y = '0';
      break;
    //case 44:3: //cobblestone  slab
      x = '0';
      y = '1';
      break;
    //case 44:4: //brick slab
      x = '8';
      y = '0';
      break;
    //case 44:5: //stone brick slab
      x = '6';
      y = '3';
      break;
    case 45: //brick
      x = '7';
      y = '0';
      break;
    case 46: //tnt
      x = '8';
      y = '0';
      break;
    case 47: //bookcase
      x = '3';
      y = '2';
      break;
    case 48: //moss stone
      x = '4';
      y = '2';
      break;
    case 49: //obsidian
      x = '5';
      y = '2';
      break;
    case 50: //torch
      x = '0';
      y = '5';
      break;
    case 51: //fire
      break;
    case 52: //mob spawner
      x = '1';
      y = '4';
      break;
    case 53: //wooden stairs
      x = '4';
      y = '0';
      break;
    case 54: //chest
      x = '11';
      y = '1';
      break;
    case 55: //redstone wire
      break;
    case 56: //diamond ore
      x = '2';
      y = '3';
      break;
    case 57: //block of diamond
      x = '8';
      y = '1';
      break;
    case 58: //work bench
      x = '11';
      y = '2';
      break;
    case 59: //wheat (crop)
      x = '15';
      y = '5';
      break;
    case 60: //farmland
      x = '6';
      y = '5';
      break;
    case 61: // furnace
      x = '12';
      y = '2';
      break;
    case 62: // furnace (smelting)
      x = '13';
      y = '3';
      break;
    case 63: // sign (block)
      break;
    case 64: // wood door (block)
      x = '1';
      y = '6';
      break;
    case 65: // ladder
      x = '3';
      y = '5';
      break;
    case 66: // rails
      x = '0';
      y = '8';
      break;
    case 67: // cobblestone stairs
      break;
    case 68: // sign (wall block)
      break;
    case 69: // lever
      break;
    case 70: // stone pressure plate
      x = '6';
      y = '0';
      break;
    case 71:// iron door (block)
      x = '2';
      y = '6';
      break;
    case 72: // wooden pressure plate
      break;
    case 73:  // redstone ore
      x = '3';
      y = '3';
      break;
    case 74: // redstone ore (glowing)
      break;
    case 75: // redstone torch (off)
      x = '3';
      y = '5';
      break;
    case 76: // redstone torch
      x = '3';
      y = '6';
      break;
    case 77: // stone button
      break;
    case 78: // snow
      x = '2';
      y = '4';
      break;
    case 79: // ice
      x = '3';
      y = '4';
      break;
    case 80: // snow block
      x = '2';
      y = '4';
      break;
    case 81: // cactus
      x = '6';
      y = '4';
      break;
    case 82: // clay block
      x = '8';
      y = '4';
      break;
    case 83: // sugar cane (block)
      x = '9';
      y = '4';
      break;
    case 84: // jukebox
      x = '11';
      y = '4';
      break;
    case 85: // fence
      break;
    case 86: // pumpkin
      x = '7';
      y = '7';
      break;
    case 87: // netherrack
      x = '7';
      y = '6';
      break;
    case 88: // soul sand
      x = '8';
      y = '6';
      break;
    case 89: // glowstone
      x = '9';
      y = '6';
      break;
    case 90: // portal
      break;
    case 91: // jack-o-lantern
      x = '8';
      y = '7';
      break;
    case 92: // cake (block)
      x = '9';
      y = '7';
      break;
    case 93: // redstone repeater (block off)
      x = '3';
      y = '8';
      break;
    case 94: // redstone repeater (block on)
      x = '3';
      y = '9';
      break;
    case 95: // locked chest
      break;
    case 96: // trapdoor
      x = '4';
      y = '5';
      break;
    case 97: // silverfish stone
      break;
    case 98: // stone bricks
      x = '6';
      y = '3';
      break;
    //case 98:1: // mossy stone bricks
      x = '4';
      y = '6';
      break;
    //case 98:2: // cracked stone bricks
      x = '2';
      y = '4';
      break;
    case 99: // brown mushroom (block)
      x = '13';
      y = '7';
      break;
    case 100: // red mushroom (block)
      x = '12';
      y = '7';
      break;
    case 101: // iron bars
      x = '5';
      y = '5';
      break;
    case 102: // glass pane
      x = '1';
      y = '3';
      break;
    case 103: // melon (block)
      x = '8';
      y = '8';
      break;
    case 104: // pumpkin vine
      break;
    case 105: // melon vine
      break;
    case 106: // vines
      break;
    case 107: // fence gate
      break;
    case 108: // brick stairs
      x = '0';
      y = '7';
      break;
    case 109: // stone brick stairs
      x = '1';
      y = '0';
      break;
    case 110: // mycelium
      break;
    case 111: // lily pad
      break;
    case 112: // nether brick
      break;
    case 113: // nether brick fence
      break;
    case 114: // nether brick stairs
      break;
    case 115: // nether wart
      break;
    case 116: // enchantment table
      break;
    case 117: // brewing stand (block)
      break;
    case 118: // cauldron (block)
      break;
    case 119: // end portal
      break;
    case 120: // end portal frame
      break;
    case 121: // end stone
      x = '0';
      y = '13';
      break;
    case 122: // dragon egg
      break;
  }

    return new Array(x*16,y*16);
}
