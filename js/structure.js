blocks = new Array();
var currentZ = new Number;
var currentX = new Number;
var currentY = new Number;
var rotation = 0;
var enable3d = false;
var ready = false;

window.onload=function(){
  blocks = loadBlocks();

  if (Drupal.settings.structureMode == 'edit') {
    structureBuild();
  }
  
  (function ($) {
    $(document).ready(function(){
      $('a.enable-3d').click(function() {
        initiate3d();
        enable3d = true;
        return false;
      });
            
    });
  })(jQuery); 
  
  var startTime = new Date();
  var endTime = new Date();
}
 /* Provide blocks as array from document as string. This function will
  * be used to deserialize blocks data from the database
  * 
  * @return blocks as array
  */
  function loadBlocks() {
    startTime = new Date().getTime();
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
    }
    endTime = new Date().getTime();
    console.log('Execution time of loadBlocks(): ' + (Number(endTime) - Number(startTime)));

    return blocks;
  }

function structureBuild() {
  (function ($) {
    $(document).ready(function(){
      drawControls(currentZ, currentX, currentY, blocks);
      
      $('.up-z').click(function() {
        console.log('up');
        currentZ++;
        drawControls(currentZ, currentX, currentY, blocks); 
        if (enable3d) {
          grid = drawGrid(scene, currentZ, grid);
        }
        return false;
      });

      $('.down-z').click(function() {
        console.log('down');
        currentZ--;
        drawControls(currentZ, currentX, currentY, blocks);  
        if (enable3d) {
          grid = drawGrid(scene, currentZ, grid);
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
      
      
      $('#edit-block-type input').next().append('<span class="block-rotation"><a href="#rotate" class="block-rotate rotation-' + rotation + '">Rotation ' + rotationSymbol(rotation) + '</a></span>');
      $('#edit-block-type input').parent().find('.block-rotation').hide();
      $('#edit-block-type input:checked').parent().find('.block-rotation').show();
      
      $('#edit-block-type').change(function(){
        $('#edit-block-type input').parent().find('.block-rotation').hide();
        $('#edit-block-type input:checked').parent().find('.block-rotation').show();
      });
      
      $('a.block-rotate').click(function(){
        if (rotation < 3) { rotation++ }
        else { rotation = 0; }
        $('#edit-block-type .block-rotate').attr('class', 'block-rotate rotation-' + rotation);
        $('#edit-block-type .block-rotate').text('Rotation ' + rotationSymbol(rotation));
        return false;
      });

      $('#edit-submit').click(function() {
        var blockstr = new String;
        $('#edit-field-structurearray-und-0-value').val('');
        for (var i = 0, block; block = blocks[i]; i++) {
          for (var j = 0; block[j]; j++) {
            block[j] = '[' + block[j] + ']';
          }
        blockstr += block.slice(0,5).toString().replace(/,/g, '') + ',';
        }
        $('#edit-field-structurearray-und-0-value').val(blockstr);
      });

      $('#structure-node-form .xy-grid').selectable({
        
        selecting: function(event, ui){ 
          $(".ui-selecting:not(.ui-unselecting)", this).each(function(){
              if($(this).attr('style')){
                $(this).attr('oldstyle', $(this).attr('style'));
              }
              $(this).css('background-image', 'url(' + '\'/' + Drupal.settings.structurePath + '/sprites/mc-sprite_' + $('input:radio[name=block_type]:checked').val() + '.png\')');
              $(this).css('opacity', '1');
              $(this).addClass('ui-unselecting')
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
          $(".ui-selected", this).each(function(){
            $(this).removeAttr('oldstyle');
            $(this).removeClass('ui-unselecting');
            block = identifyBlock(this);
            type = $('input:radio[name=block_type]:checked').val();
            $(this).attr('class', 'mc-block '+ type);
            blocks = addBlock(blocks,block);
          });
          drawControls(currentZ, currentX, currentY, blocks);
        }
      });
      
      /* Small helper function to determine which arrow symobl to print
       * 
       * @param rotation
       * 
       * @return string as either ↑, →, ↓ or ←
       */
      function rotationSymbol(rotation) {
             if (rotation == '0') { return '↑'; }
        else if (rotation == '1') { return '→'; }
        else if (rotation == '2') { return '↓'; }
        else { return '←'; }
      }
      

     /* Add array block to array blocks
      * 
      * @param blocks as array
      * @param block as array
      * @return blocks as array
      */
      function addBlock(blocks,block) {
        startTime = new Date().getTime();

        for(var i=0; blocks[i]; i++) {
         /* 
          * First run through all items in blocks array and 
          * make sure that block is unique
          */
          if (block[0] == blocks[i][0]
            && block[1] == blocks[i][1]
            && block[2] == blocks[i][2]
            && block[3] == blocks[i][3]
            && block[3] == blocks[i][4]) {
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
              killBlock(blocks[i][5]);
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
          
          if (enable3d) {
            block = drawBlock(block);
          }
        }
        endTime = new Date().getTime();
        console.log('Execution time of addBlock(): ' + (Number(endTime) - Number(startTime)));
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
        startTime = new Date().getTime();
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
              transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
              -ms-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
              -moz-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
              -webkit-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
              -o-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
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
                  transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
                  -ms-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
                  -moz-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
                  -webkit-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
                  -o-transform:rotate(' + blocks[i][4]*90 + 'deg);\n\
                  opacity: ' + (.5 - (j/10)) + ' ;');
                break;
              }
            }
          }
        }
        endTime = new Date().getTime();
        console.log('Execution time of drawControls(): ' + (Number(endTime) - Number(startTime)));
      }

     /* Provide .xy-grid .mc-block element and return it as block array
      * 
      * @param thisblock as HTML element
      * @return new Array as structured block (X,Y,Z,TYPE)
      */
      function identifyBlock(thisblock) {
        startTime = new Date().getTime();
        //isolate the coordinates
        id = $(thisblock).attr("id");
        coords = id.replace(/[^0-9-_.]/g, "");
        coords = coords.split("_");
        return new Array (coords[0],coords[1],coords[2],$('input:radio[name=block_type]:checked').val(),rotation);
        endTime = new Date().getTime();
        console.log('Execution time of identifyBlock(): ' + (Number(endTime) - Number(startTime)));
      }

    });
  })(jQuery); 
}