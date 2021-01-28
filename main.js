( function ( $ ) {
    'use strict';
    $( document ).ready( function () {

      let SIZE = 128;
      let ROWS = 5;
      let COLS = 4;
      let MARGIN = 10;
      let scene = document.querySelector('#scene');
      let cardObjects = [];
      let canvases = [];
      let contextes =[];
      let numberOfCards = ROWS*COLS;
      let cardIndexes = [];
      let startButton = document.querySelector('#startButton');   
       //initialy disable game screen
      
      scene.style.display = "none";
            
      $('#startButton').hover( function(){
        
        $('#startButton').effect("bounce", "slow");
        
      });
       
            $('#startButton').click(function(){
               $('#startContainer').hide("drop", { direction: "up" }, "fast", function(){
                   $('#scene').show("clip");
               });
              
            });
            
            
            
            
            
            
            
            
            
            
      for(let i = 0; i < numberOfCards; i++ ){
        cardIndexes[i] = i;
      }
      let spriteIndexes = [];
      
      function atributeCardIndexToTile(){
        let cards = [];
      
        for(let i = 0; i < numberOfCards; i++ ){
          let randomIndex = Math.floor(Math.random()*cardIndexes.length);
          cards.push( parseInt( cardIndexes.splice( randomIndex, 1)));
        }
        console.log(cards);
      
        for (let i = 0; i < 10; i++){
          //iterate symbols idexes
          for(let j = 0; j < 2; j++ ){
          let cardIndex = cards.pop();
          spriteIndexes[cardIndex] = i;
          }
        }
        console.log(spriteIndexes);
      }
      
      let card = {
        HID: 0,
        VISIBLE: 1,
        GUESSED: 2,
        state: this.HID,
        tilesheetIndex: undefined,
        sourceX: undefined,
        sourceY: undefined,
        size:SIZE,
        x: 0,
        y: 0,
        revealCounter: 0,
        getSource: function(){
          let rows = 4;
          let cols = 3;
          this.sourceX = Math.floor(this.tilesheetIndex % cols) * 128;
          this.sourceY = Math.floor(this.tilesheetIndex / cols) * 128;
        }
      };
      
      let img = new Image();
      img.addEventListener("load", loadHandler, false);
      img.src = "https://raw.githubusercontent.com/bmat1/simon-game/master/tileSheet.png";
      //locally change above to img.src = "tileSheet.png";
      atributeCardIndexToTile();
      for(let i = 0; i < numberOfCards; i++){
        let newCard = Object.create(card);
        newCard.tilesheetIndex = spriteIndexes[i];
        newCard.state = card.HID;
        newCard.getSource();
      
        cardObjects.push(newCard);
      }
            
            
      
      
      
      for(let col = 0;col<COLS; col++){
        for(let row = 0; row<ROWS; row++){
      
          let canvas = document.createElement('canvas');
          canvas.setAttribute('width','128px');
          canvas.setAttribute('height','128px');
          canvas.setAttribute('id', canvases.length);
          canvas.style.backgroundColor ="#ffffff";
          canvas.style.position = 'realtive';
          canvas.style.left = col*(SIZE+MARGIN)+'px';
          canvas.style.top = row*(SIZE+MARGIN)+'px';
          let ctx = canvas.getContext('2d');
          canvases.push(canvas);
          contextes.push(ctx);
          scene.appendChild(canvas);
        }
      }
            
       
            
            
      let game = {
        movesNumber: 0,
         pairTiles: [],
         pairIndexes:[],
         foundPair: false,
      };
      
      function loadHandler(){
        for(let i = 0; i<canvases.length; i++){
          let canvas = canvases[i];
        }
        scene.addEventListener("touchstart", clickHandler,false);
        scene.addEventListener("mousedown", clickHandler,false);
      }
      function clickHandler(e){
        console.log(e.target.id);
       
        
        let index = e.target.id;
        let clickedCard = cardObjects[index];
      
        if(clickedCard.state === card.HID){
      
          switch (game.pairTiles.length) {
            case 0:
            clickedCard.state = card.VISIBLE;
            clickedCard.revealCounter++;
              console.log( clickedCard.revealCounter);
            game.pairTiles[0] = clickedCard.tilesheetIndex;
            game.pairIndexes[0] = index;
            
             
              
              break;
            case 1:
            clickedCard.state = card.VISIBLE;
            game.pairTiles[1] = clickedCard.tilesheetIndex;
            game.pairIndexes[1] = index;
      
            if(game.pairTiles[0]===game.pairTiles[1]){
              game.foundPair = true;
                let card1 = game.pairIndexes[0];
                  let card2 = game.pairIndexes[1];
              let notGuessed = 0;
              for(let i = 0; i<cardObjects.length; i++){
                if(cardObjects[i].state !== card.GUESSED){
                  notGuessed++;
                }
              }
              if(notGuessed === 2){
                  cardObjects[card1].state = card.GUESSED;
                    cardObjects[card2].state = card.GUESSED;
      
      
                    location.reload();
              }
            }else{
              game.foundPair = false;
            }
            break;
            case 2:
            let card1 = game.pairIndexes[0];
            cardObjects[card1].state = card.GUESSED;
            let card2 = game.pairIndexes[1];
            cardObjects[card2].state = card.GUESSED;
            if(!game.foundPair){
             cardObjects[game.pairIndexes[0]].state = card.HID;
             cardObjects[game.pairIndexes[1]].state = card.HID;
           }
            
           game.pairIndexes = [];
           game.pairIndexes[0] = index;
           game.pairTiles = [];
           game.pairTiles[0] = clickedCard.tilesheetIndex;
           clickedCard.state = card.VISIBLE;
            break;
          }
          //clickedCard.state = card.VISIBLE;
        }
        render();
      }
      function render(){
      
        for(let i = 0; i<canvases.length;i++){
          let clickedCard = cardObjects[i];
          let ctx = contextes[i];
          ctx.clearRect(0,0,SIZE,SIZE);
          if(clickedCard.state === clickedCard.HID){
      
            ctx.drawImage(img,128,384,128,128,0,0,128,128);
          }else if(clickedCard.state === clickedCard.VISIBLE){
      
            ctx.drawImage(img,clickedCard.sourceX,clickedCard.sourceY,SIZE,SIZE, 10,10,108,108);
          } else {
            ctx.clearRect(0,0,SIZE,SIZE);
            let canvas = $(canvases[i]);
      
            canvas.animate({
              backgroundColor: "rgb(0,0,0)"
            });
            canvas.css({
              'box-shadow': '2px 1px 8px rgb(18, 219, 238), -2px -2px 8px rgb(18, 219, 238)',
      
            });
          
      
          }
        }
      }
      
      });//ready
      
} ( jQuery ) )//end of ready statement
