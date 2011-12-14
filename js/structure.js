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
  temp();
  function temp() {
    temp[1] = '2',
    temp[2] = '1',
    temp[6] = '43',
    temp[7] = '70',
    temp[8] = '45',
    temp[9] = '46',
    temp[13] = '38',
    temp[14] = '37',
    temp[16] = '6',
    temp[17] = '4',
    temp[18] = '7',
    temp[19] = '12',
    temp[20] = '13',
    temp[22] = '17',
    temp[23] = '42',
    temp[24] = '41',
    temp[25] = '57',
    temp[28] = '54',
    temp[29] = '40',
    temp[30] = '39',
    temp[33] = '14',
    temp[34] = '15',
    temp[35] = '16',
    temp[36] = '47',
    temp[38] = '49',
    temp[44] = '58',
    temp[45] = '61',
    temp[47] = '23',
    temp[49] = '19',
    temp[50] = '20',
    temp[51] = '56',
    temp[52] = '73',
    temp[55] = '98',
    temp[56] = '32',
    temp[64] = '6:1',
    temp[65] = '35',
    temp[66] = '52',
    temp[67] = '78',
    temp[68] = '79',
    temp[71] = '81',
    temp[73] = '82',
    temp[74] = '83',
    temp[76] = '84',
    temp[80] = '6:2',
    temp[81] = '50',
    temp[82] = '64',
    temp[83] = '71',
    temp[84] = '65',
    temp[85] = '96',
    temp[86] = '101',
    temp[98] = '64',
    temp[99] = '71',
    temp[100] = '76',
    temp[101] = '98:1',
    temp[103] = '86',
    temp[104] = '87',
    temp[105] = '88',
    temp[106] = '89',
    temp[107] = '29',
    temp[108] = '33',
    temp[113] = '35:15',
    temp[114] = '35:7',
    temp[117] = '17:1',
    temp[118] = '17:2',
    temp[120] = '91',
    temp[122] = '92',
    temp[125] = '100',
    temp[126] = '99',
    temp[128] = '66',
    temp[129] = '35:14',
    temp[130] = '35:6',
    temp[131] = '94',
    temp[137] = '103',
    temp[145] = '22',
    temp[146] = '35:13',
    temp[147] = '35:5',
    temp[161] = '21',
    temp[162] = '35:12',
    temp[163] = '35:4',
    temp[164] = '27',
    temp[178] = '35:11',
    temp[179] = '35:3',
    temp[193] = '24',
    temp[194] = '35:10',
    temp[195] = '35:2',
    temp[196] = '28',
    temp[209] = '121',
    temp[210] = '35:9',
    temp[211] = '35:1',
    temp[223] = '9',
    temp[226] = '35:8',
    temp[238] = '11'
    
    fixed = new String();
    for(index in temp) {
      y = Math.floor(index/16);
      x = (index-(y*16))-1;
      fixed += '\ncase \'' + temp[index] + '\':\n x = \'' + x + '\';\n y = \'' + y + '\';';
    }
    console.log(fixed);
  }
  
  function textureDefinition(blockid) {
    switch (blockid) {
      case   '0':
      case   '1':
      case   '2':
      case   '3':
      case   '4':
      case   '5':
      case   '6':
      case   '6:1':
      case   '6:2':
      case   '7':
      case   '8':
      case   '9':
      case  '10':
      case  '11':
      case  '12':
      case  '13':
      case  '14':
      case  '15':
      case  '16':
      case  '17':
      case  '17:1':
      case  '17:2':
      case  '18':
      case  '18:1':
      case  '18:2':
      case  '19':
      case  '20':
      case  '21':
      case  '22':
      case  '23':
      case  '24':
      case  '25':
      case  '26':
      case  '27':
      case  '28':
      case  '29':
      case  '30':
      case  '31':
      case  '31:1':
      case  '31:2':
      case  '32':
      case  '33':
      case  '34':
      case  '35':
      case  '35:1':
      case  '35:2':
      case  '35:3':
      case  '35:4':
      case  '35:5':
      case  '35:6':
      case  '35:7':
      case  '35:8':
      case  '35:9':
      case  '35:10':
      case  '35:11':
      case  '35:12':
      case  '35:13':
      case  '35:14':
      case  '35:15':
      case  '36':
      case  '37':
      case  '38':
      case  '39':
      case  '40':
      case  '41':
      case  '42':
      case  '43':
      case  '43:1':
      case  '43:2':
      case  '43:3':
      case  '43:4':
      case  '43:5':
      case  '44':
      case  '44:1':
      case  '44:2':
      case  '44:3':
      case  '44:4':
      case  '44:5':
      case  '45':
      case  '46':
      case  '47':
      case  '48':
      case  '49':
      case  '50':
      case  '51':
      case  '52':
      case  '53':
      case  '54':
      case  '55':
      case  '56':
      case  '57':
      case  '58':
      case  '59':
      case  '60':
      case  '61':
      case  '62':
      case  '63':
      case  '64':
      case  '65':
      case  '66':
      case  '67':
      case  '68':
      case  '69':
      case  '70':
      case  '71':
      case  '72':
      case  '73':
      case  '74':
      case  '75':
      case  '76':
      case  '77':
      case  '78':
      case  '79':
      case  '80':
      case  '81':
      case  '82':
      case  '83':
      case  '84':
      case  '85':
      case  '86':
      case  '87':
      case  '88':
      case  '89':
      case  '90':
      case  '91':
      case  '92':
      case  '93':
      case  '94':
      case  '95':
      case  '96':
      case  '97':
      case  '98':
      case  '98:1':
      case  '98:2':
      case  '99':
      case  '100':
      case  '101':
      case  '102':
      case  '103':
      case  '104':
      case  '105':
      case  '106':
      case  '107':
      case  '108':
      case  '109':
      case  '110':
      case  '111':
      case  '112':
      case  '113':
      case  '114':
      case  '115':
      case  '116':
      case  '117':
      case  '118':
      case  '119':
      case  '120':
      case  '121':
      case  '122':
    }
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
             if (rotation == '0') { symbol = '\u2191'; }
        else if (rotation == '1') { symbol = '\u2192'; }
        else if (rotation == '2') { symbol = '\u2193'; }
        else { symbol = '\u2190'; }
        return symbol;
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