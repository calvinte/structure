function updateBlocks(blocks) {
  if (blocks[0][0] != 'version: ' + currentVersion){
    if (blocks[0][0].indexOf('version: ') >= 0) {
      blocksVersion = blocks[0][0].replace(/[^\d]/g, '');
    }
    else {
      blocks.unshift('version: 0');
      blocksVersion = 0;
    }
    
    for (blocksVersion; blocksVersion<currentVersion; blocksVersion++) {
      switch (blocksVersion) {
        case 0:
          blocks = blocksUpdate_0(blocks);
        break;
      }
    }
    
  }
  
  function blocksUpdate_0(blocks) {
    //do stuff
    for (var i = 0; blocks[i] ;i++) {
      switch (blocks[i][3]) {
        case '1':
          blocks[i][3] = '2';
          break;
        case '2':
          blocks[i][3] = '1';
          break;
        case '6':
          blocks[i][3] = '43';
          break;
        case '7':
          blocks[i][3] = '70';
          break;
        case '8':
          blocks[i][3] = '45';
          break;
        case '9':
          blocks[i][3] = '46';
          break;
        case '13':
          blocks[i][3] = '38';
          break;
        case '14':
          blocks[i][3] = '37';
          break;
        case '16':
          blocks[i][3] = '6';
          break;
        case '17':
          blocks[i][3] = '4';
          break;
        case '18':
          blocks[i][3] = '7';
          break;
        case '19':
          blocks[i][3] = '12';
          break;
        case '20':
          blocks[i][3] = '13';
          break;
        case '22':
          blocks[i][3] = '17';
          break;
        case '23':
          blocks[i][3] = '42';
          break;
        case '24':
          blocks[i][3] = '41';
          break;
        case '25':
          blocks[i][3] = '57';
          break;
        case '28':
          blocks[i][3] = '54';
          break;
        case '29':
          blocks[i][3] = '40';
          break;
        case '30':
          blocks[i][3] = '39';
          break;
        case '33':
          blocks[i][3] = '14';
          break;
        case '34':
          blocks[i][3] = '15';
          break;
        case '35':
          blocks[i][3] = '16';
          break;
        case '36':
          blocks[i][3] = '47';
          break;
        case '37':
          blocks[i][3] = '4';
          break;
        case '38':
          blocks[i][3] = '49';
          break;
        case '44':
          blocks[i][3] = '58';
          break;
        case '45':
          blocks[i][3] = '61';
          break;
        case '47':
          blocks[i][3] = '23';
          break;
        case '49':
          blocks[i][3] = '19';
          break;
        case '50':
          blocks[i][3] = '20';
          break;
        case '51':
          blocks[i][3] = '56';
          break;
        case '52':
          blocks[i][3] = '73';
          break;
        case '55':
          blocks[i][3] = '98';
          break;
        case '56':
          blocks[i][3] = '32';
          break;
        case '64':
          blocks[i][3] = '6:1';
          break;
        case '65':
          blocks[i][3] = '35';
          break;
        case '66':
          blocks[i][3] = '52';
          break;
        case '67':
          blocks[i][3] = '78';
          break;
        case '68':
          blocks[i][3] = '79';
          break;
        case '*69':
          blocks[i][3] = '';
          break;
        case '71':
          blocks[i][3] = '81';
          break;
        case '73':
          blocks[i][3] = '82';
          break;
        case '74':
          blocks[i][3] = '83';
          break;
        case '76':
          blocks[i][3] = '84';
          break;
        case '80':
          blocks[i][3] = '6:2';
          break;
        case '81':
          blocks[i][3] = '50';
          break;
        case '*82':
          blocks[i][3] = '64';
          break;
        case '*83':
          blocks[i][3] = '71';
          break;
        case '84':
          blocks[i][3] = '65';
          break;
        case '85':
          blocks[i][3] = '96';
          break;
        case '86':
          blocks[i][3] = '101';
          break;
        case '96':
          blocks[i][3] = '59';
          break;
        case '98':
          blocks[i][3] = '64';
          break;
        case '99':
          blocks[i][3] = '71';
          break;
        case '100':
          blocks[i][3] = '76';
          break;
        case '101':
          blocks[i][3] = '98:1';
          break;
        case '103':
          blocks[i][3] = '86';
          break;
        case '104':
          blocks[i][3] = '87';
          break;
        case '105':
          blocks[i][3] = '88';
          break;
        case '106':
          blocks[i][3] = '89';
          break;
        case '107':
          blocks[i][3] = '29';
          break;
        case '108':
          blocks[i][3] = '33';
          break;
        case '112':
          blocks[i][3] = '66';
          break;
        case '113':
          blocks[i][3] = '35:15';
          break;
        case '114':
          blocks[i][3] = '35:7';
          break;
        case '117':
          blocks[i][3] = '17:1';
          break;
        case '118':
          blocks[i][3] = '17:2';
          break;
        case '120':
          blocks[i][3] = '91';
          break;
        case '122':
          blocks[i][3] = '92';
          break;
        case '125':
          blocks[i][3] = '100';
          break;
        case '126':
          blocks[i][3] = '99';
          break;
        case '128':
          blocks[i][3] = '66';
          break;
        case '129':
          blocks[i][3] = '35:14';
          break;
        case '130':
          blocks[i][3] = '35:6';
          break;
        case '131':
          blocks[i][3] = '94';
          break;
        case '136':
          blocks[i][3] = '26';
          break;
        case '137':
          blocks[i][3] = '103';
          break;
        case '142':
          blocks[i][3] = '99';
          break;
        case '145':
          blocks[i][3] = '22';
          break;
        case '146':
          blocks[i][3] = '35:13';
          break;
        case '147':
          blocks[i][3] = '35:5';
          break;
        case '161':
          blocks[i][3] = '21';
          break;
        case '162':
          blocks[i][3] = '35:12';
          break;
        case '163':
          blocks[i][3] = '35:4';
          break;
        case '164':
          blocks[i][3] = '27';
          break;
        case '178':
          blocks[i][3] = '35:11';
          break;
        case '179':
          blocks[i][3] = '35:3';
          break;
        case '193':
          blocks[i][3] = '24';
          break;
        case '194':
          blocks[i][3] = '35:10';
          break;
        case '195':
          blocks[i][3] = '35:2';
          break;
        case '196':
          blocks[i][3] = '28';
          break;
        case '209':
          blocks[i][3] = '121';
          break;
        case '210':
          blocks[i][3] = '35:9';
          break;
        case '211':
          blocks[i][3] = '35:1';
          break;
        case '223':
          blocks[i][3] = '9';
          break;
        case '226':
          blocks[i][3] = '35:8';
          break;
        case '238':
          blocks[i][3] = '11';
      }
    }
    return blocks;
  }
  blocks.splice(0,1);
  return blocks;
}