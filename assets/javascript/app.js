$(document).ready(function(){
  
    //event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    
    //trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',
    
    //questions options and answers
    questions: {
      q1: "What year did WWII start and end?",
      q2: "What was the most produced tank of WWII?",
      q3: "What tank did the allies fear the most?",
      q4: "What was the biggist problem with germany's Panther tank?",
      q5: "what was the pinnacle of german heavy tank design?",
      q6: "What was the biggest tank battle of WWII?",
      q7: "Who was germany's most famus tank Ace of WWII?"
    },
    options: {
      q1: ["1939-1945", "1914-1918", "1947-1991", "1939-1947"],
      q2: ["Cromwell", "Pz IV", "T-34", "M4 Sherman"],
      q3: ["Pz IV", "Tiger I", "Panther", "Tiger II (King Tiger)"],
      q4: ["they were unreliable", "they were too heavy", "There wasn't enough of them", "They didn't have enough armor"],
      q5: ["Panther","Tiger I","Tiger II","Maus"],
      q6: ["The Second Battle of El Alamein","The Battle of Brody","The Battle of Raseiniai","The Battle of Kursk"],
      q7: ["Kurt Knispel", "Walter Kniep", "Otto Carius","Michael Wittmann"]
    },
    answers: {
      q1: "1939-1945",
      q2: "M4 Sherman",
      q3: "Tiger I",
      q4: "they were unreliable",
      q5: "Tiger II",
      q6: "The Battle of Kursk",
      q7: "Michael Wittmann"
    },
    
    //trivia methods
    //initialize the game
    startGame: function(){
      
        //restarting game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      //shows game section
      $('#game').show();
      
      //resets last results
      $('#results').html('');
      
      //shows timer
      $('#timer').text(trivia.timer);
      
      //removes start button
      $('#start').hide();
  
      $('#remaining-time').show();
      
      //ask first question
      trivia.nextQuestion();
      
    },
    //loop through and display questions and options 
    nextQuestion : function(){
      
      //set timer to 40 seconds each question
      trivia.timer = 40;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
      //prevent timer speed up
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      //gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      //an array of all the user options for the current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
      //creates all the trivia guess options in the html
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },
    //countdown timer and count unanswered if timer runs out
    timerRunning : function(){
      //if there is still time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      //the time has run out, update unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      //if all the questions have been asked, end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        //adds results of game to the page
        $('#results')
          .html('<h3>Thank you for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
        //hide game sction
        $('#game').hide();
        
        //show start button for a new game
        $('#start').show();
      }
      
    },
    //evaluate the option clicked
    guessChecker : function() {
      
      //timer ID for gameResult setTimeout
      var resultId;
      
      //the answer to the current question
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      //if the text of the option picked matches the answer of the current question
      if($(this).text() === currentAnswer){
        //turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Correct Answer!</h3>');
      }
      //else the user picked the wrong option
      else{
        //turn button clicked red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
      }
      
    },
    //remove previous question results and options
    guessResult : function(){
      
      // increment to next question set
      trivia.currentSet++;
      
      //remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      //next question
      trivia.nextQuestion();
       
    }
  
  }