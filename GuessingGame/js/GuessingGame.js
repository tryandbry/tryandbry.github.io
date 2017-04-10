
function generateWinningNumber(){
  return Math.floor(Math.random()*100 + 1);
}

/*******************************************
 * Title: shuffle
 * Author: Mike Bostock
 * Date: 01/14/2012
 * Availability: https://bost.ocks.org/mike/shuffle/
*******************************************/
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

function Game(){
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
  return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function(){
  return this.playersGuess < this.winningNumber ? true : false;
}

Game.prototype.playersGuessSubmission = function(n){
  if(typeof n != "number" ||
                  n > 100 ||
                  n < 1) throw "That is an invalid guess.";
  this.playersGuess = n;
  return this.checkGuess(n);
}

Game.prototype.checkGuess = function(n){
  if(this.playersGuess == this.winningNumber) {
    this.pastGuesses.push(n);
    return 'You Win!';
  }
  else if(this.pastGuesses.indexOf(n) != -1) return "You have already guessed that number.";
  else if(this.pastGuesses.length == 4) {
    this.pastGuesses.push(n);
    return 'You Lose.';
  }
  else {
    this.pastGuesses.push(n);
    if(Math.abs(this.playersGuess - this.winningNumber) < 10) return "You\'re burning up!";
    else if(Math.abs(this.playersGuess - this.winningNumber) < 25) return "You\'re lukewarm.";
    else if(Math.abs(this.playersGuess - this.winningNumber) < 50) return "You\'re a bit chilly.";
    else return"You\'re ice cold!";
  }
}

function newGame(){
  return new Game();
}


Game.prototype.provideHint = function(){
  var hint = [];
  hint.push(this.winningNumber);
  hint.push(generateWinningNumber());
  hint.push(generateWinningNumber());

  return shuffle(hint);
}

// BEGIN JQUERY SECTION
// ***************************
$(document).ready(function(){
  var game = new Game();

  var submission = function(){
    var guesscount = game.pastGuesses.length;
    var input = +$('#input-field').val();
    $('#input-field').val('');
    $('#headers').find('h1').text(game.playersGuessSubmission(input));
    if(game.pastGuesses.length != guesscount){
      $('.guess').filter(function(){
        return $(this).text() == '-'
      }).first().text(input);
      // disable buttons if win/lose
      if(game.pastGuesses.length == 5 ||
         game.playersGuess == game.winningNumber){
        $('#input-go').attr('disabled','true');
        $('#btn-hint').attr('disabled','true');
        $('#headers').find('h2').text("Hit the reset button to play again");
      }
    }
  }

  $('#input-go').on('click',submission);
  $('#input-field').on('keypress',function(event){
    if(event.which == 13) submission();
  });

  $('#btn-reset').on('click',function(){
    game = new Game();
    $('.guess').text('-');
    $('#input-go').removeAttr('disabled');
    $('#btn-hint').removeAttr('disabled');
    $('#headers').find('h1').text("Play the guessing Game!");
    $('#headers').find('h2').text("Guess a number between 1-100");
  });

  $('#btn-hint').on('click',function(){
    var hint = game.provideHint();
    $('#headers').find('h1').text("It's one of these: [ " +
                                  hint[0] + ", " + 
                                  hint[1] + ", " + 
                                  hint[2] + " ]" );
  });
});















