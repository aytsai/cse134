var mLastSectionId;  	// This holds the id of the last section in the quizmaker
var mQuestionsPerPage; 	// This holds the number of questions per page
var mPageNumber;		// This holds the page number user is currently on.
var mTotalQuestions;	
/**
 * This function helps move sections around
 */
$(function() {
    $("#qs").sortable(
      {
        cancel: ':input,button,[contenteditable]',
        handle: '.move_section'
      }
    );
});

$(function() {
  $( "#mini_qs" ).sortable({
      start: function(e, ui) {
         // puts the old positions into array before sorting
    	  $(this).attr('data-previndex', ui.item.index());
      },
	  update: function( event, ui ) {
		  var newIndex = ui.item.index();
          var oldIndex = $(this).attr('data-previndex');
          $(this).removeAttr('data-previndex');
          var sectionObj = $("#qs li:eq(" + oldIndex +")");
          if(newIndex == 0) {
          } else {
        	  
          }
	  }
  });
});

/** 
 * Recenters dialog when window is resized. 
 */
$(window).resize(function(){
    $(".ui-dialog-content").dialog("option","position","center");
});

/**
 * This helps validate the quiz form and if everything validates it will open up the preview in a new tab.
 */
function preview() {
    var flag = true;
	var firstError;
    $(".multiple_choice").each(function() {
        $(this).validate({
            messages: {
                prompt1: "Please enter a prompt!",
                answer: "Please enter a choice!"
            },
            errorPlacement: function(error, element) {
				if(!firstError) { 
					firstError = element;
				}
                element.attr('placeholder', (error.text()));
                element.addClass("error_placeholder");
            }
        });
        if (!$(this).valid()) flag = false;
    });
    $("input.no_border.choice.required").each(function() {
        if (!$(this).val()) {
			if(!firstError) { 
				firstError = $(this);
			}
            flag = false;
            $(this).attr('placeholder', "Please enter a choice!");
            $(this).addClass("error_placeholder");
        }
    })
    $(".true_false").each(function() {
        $(this).validate({
            messages: {
                prompt2: "<br>Please enter a prompt!<br>"
            },
            errorPlacement: function(error, element) {
				if(!firstError) { 
					firstError = element;
				}
                element.attr('placeholder', (error.text()));
                element.addClass("error_placeholder");
            }
        });
        if (!$(this).valid()) flag = false;
    });
    $(".short_answer").each(function() {
        $(this).validate({
            messages: {
               prompt3: "Please enter a prompt!",
               mincount: "???",
               maxcount: "???"
            },
            errorPlacement: function(error, element) {
				if(!firstError) { 
					firstError = element;
				}
                element.attr('placeholder', (error.text()));
                element.addClass("error_placeholder");
            }
        });
        if (!$(this).valid()) flag = false;
    });
    $(".fill_in").each(function() {
        $(this).validate({
            messages: {
                prompt4: "<br>Please enter a prompt!"
            },
            errorPlacement: function(error, element) {
				if(!firstError) { 
					firstError = element;
				}
                element.attr('placeholder', (error.text()));
                element.addClass("error_placeholder");
            }
        });
        if (!$(this).valid()) flag = false;
    });
    $("input[type='number']").each(function() {
        if (!$(this).val()) {
			if(!firstError) { 
				firstError = $(this);
			}
            flag = false;
            $(this).attr('placeholder', "??");
            $(this).addClass("error_placeholder");
        }
    })
    if(flag == true) {
        window.localStorage.setItem('savedQuiz', appController.toJSON());
		window.open('quiztaker.html','_newtab');
    } else {
		$('body').animate({
			scrollTop: firstError.offset().top - 85
		}, 500);
		return false;
	}
}

/**
 * This function helps save the questions into JSON form
 */
function save() { 
    console.log('Questions Object: ', appController.questions);
    console.log('Sections Object: ', appController.sections);
    console.log('Serialized JSON: ', appController.toJSON());
    window.localStorage.setItem('savedQuiz', appController.toJSON());
		
		/*
		$.mockjax({
      url: '/group21/quizmaker',
      responseTime: 0,
      responseText: appController.toJSON()
    });
		*/
}

/**
 * Retrieves and returns the quiz object from local storage.
 * @returns {*|{}}
 */
function load() {
  /*
  var jsonResponse = null;
  $.ajax({
    url: '/group21/quizmaker',
    dataType: 'json',
    async: false,
    success: function(response) {
      jsonResponse = response;
    }
  });

  if (jsonResponse) {
    return jsonResponse;
  } else {
    return {};
  }
  */
  var obj = window.localStorage.getItem('savedQuiz');
  if (obj) {
    return JSON.parse(obj);
  } else {
    return {};
  }
}

jQuery.extend(jQuery.validator.messages, {
    required: ""
});

/**
 * This function helps switch between Page View and Show All View mode.
 */
function switchView() { 
	// Check if we're in page mode or not
	if(mPageNumber) {
	    mPageNumber = 0;
		$('#page_button').fadeOut(300, function () {
			$('#page_button').css('paddingRight', '7px');
			$('#page_button').css('paddingLeft', '9px');
			$('#page_button').html('Page View');
			$('#page_num').hide();
			$('#page_button').fadeIn(300);
			displayAll();
		});
		$('#text_q_page').fadeOut(400);
	} else {
		$('#page_button').fadeOut(300, function () {
			$('#page_button').css('paddingRight', '14px');
			$('#page_button').css('paddingLeft', '16px');;
			$('#page_button').html('Show All');
			$('#page_button').fadeIn(300);
			if(mTotalQuestions > 0) {
				mPageNumber = Math.floor((mTotalQuestions-1)/mQuestionsPerPage) + 1;
				goToPage(mPageNumber);
			} else {
				mPageNumber = 1;
			}
			$('#page_num').show();
			displayPageNumbers(mPageNumber);
		});
		$('#text_q_page').fadeIn(400);
	}
}

/**
 * This function helps display all the questions
 */
function displayAll() {
	var sectionIdsInOrder = $('#qs').sortable("toArray");
	$('#qs').fadeOut(700, function() {
	    for (var s in sectionIdsInOrder) {
	    	appController.sections[sectionIdsInOrder[s]].element.show();
	  	   var questionIdsInOrder = $('#' + sectionIdsInOrder[s] + '_qsection' ).sortable("toArray");
	 	   for (var q in questionIdsInOrder) {
	 		  appController.questions[questionIdsInOrder[q]].element.show();
	 	   }
	    }
		$('#qs').fadeIn(700);
	});
}

/**
 * This function helps display the right questions for the specified page
 */
function goToPage(pageNumber) {
	var questionCounter = 0;
	var sectionIdsInOrder = $('#qs').sortable("toArray");
	$('#qs').fadeOut(300, function() {
		var showSection;
	    for (var s in sectionIdsInOrder) {
	       showSection = false;
	  	   var questionIdsInOrder = $('#' + sectionIdsInOrder[s] + '_qsection' ).sortable("toArray");
	 	   for (var q in questionIdsInOrder) {
	 		  questionCounter++;
	 	      // Make invisible if its supposed to be displayed
	 	      var maxQuestionNum = pageNumber * mQuestionsPerPage;
	 	      var minQuestionNum = (pageNumber-1) * mQuestionsPerPage;
	 	      if(questionCounter > minQuestionNum && questionCounter <= maxQuestionNum) {
	 	    	 appController.questions[questionIdsInOrder[q]].element.show();
	 	    	 showSection = true;
	 	      } else {
	 	    	 if(appController.questions[questionIdsInOrder[q]]){ 
		 	    	 appController.questions[questionIdsInOrder[q]].element.hide();
	 	    	 }
	 	      }
	 	   }
	 	   if(showSection) {
	 		  appController.sections[sectionIdsInOrder[s]].element.show();
	 	   } else {
	 		   if(appController.sections[sectionIdsInOrder[s]]){
	 	 		  appController.sections[sectionIdsInOrder[s]].element.hide();
	 		   }
	 	   }
	    }
	    mPageNumber = pageNumber;
		$('#qs').fadeIn(300);
	});
}

/**
 * This function helps display page numbers for user to click on.
 */
function displayPageNumbers(lastPage) {
	$('#page_num').empty();

	for(var i = 1; i <= lastPage; i++) {
		var liEle = $(document.createElement('li'));
		
		if(i == lastPage) {
		    liEle.addClass('current_page');
		}
		
		liEle.addClass('pages');
		liEle.append(i);
	    liEle.on('click', function() {
	    	$('.current_page').removeClass('current_page');
	    	$(this).addClass('current_page');
	    	goToPage($(this).html());
	    });
	    $('#page_num').append(liEle);
	}

	$('.pages').on('click', function() {
    	$('.current_page').removeClass('current_page');
    	goToPage($(this).html());
    	$(this).addClass('current_page');
    });
}

/**
 * This function helps prevent user from entering non numeric values into numeric fields
 */
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


/**
 * Utility function to find and replace all occurrences of a substring in a
 * string.
 * @param {string} find String to find.
 * @param {string} replace Replacement string.
 * @param {string} str Target string.
 * @returns {string}
 */
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}


/**
 * Utility function to insert a string snippet at a specific index in another
 * string.
 * @param idx
 * @param rem
 * @param s
 * @returns {*}
 */
String.prototype.splice = function( idx, rem, s ) {
  return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};


/**
 * Utility function that returns the caret position within a textarea element.
 * @param el
 * @returns {number}
 */
function getCaret(el) {
  if (el.selectionStart) {
    return el.selectionStart;
  } else if (document.selection) {
    el.focus();

    var r = document.selection.createRange();
    if (r == null) {
      return 0;
    }

    var re = el.createTextRange(),
        rc = re.duplicate();
    re.moveToBookmark(r.getBookmark());
    rc.setEndPoint('EndToStart', re);

    return rc.text.length;
  }
  return 0;
}


/**
 * Section object. This section holds a instructions prompt.
 */
var Section = function(data, id) {
	/**
	 * Reference to element once initiated and on-screen.
	 */
	this.element = null;

	/**
	 * Reference to miniView once initiated and on-screen.
	 */
	this.miniView = null;
	
	/**
	 * The instructions for this section.
	 */
	this.instructions = "";
	
	/**
	 * Unique id for this instance.
	 * @type {number}
	 */
	this.id = 0;
	if(id) { 
		this.id = id;
	}

	/**
	 * Template string for this section object.
     * @type {string}
     */
    this.template = $('#tmpl_section').html();

	/**
	 * Template string for this section mini view.
     * @type {string}
     */
    this.miniViewTemplate = $('#tmpl_mini_section').html();
	
	/**
	 * Delete listener
	 */
	this.onDelete = null;
	
	if(data) {
		this.instructions = data.instructions;
	}
}


Section.prototype.bindEvents = function() {
	var self = this;

	$(this.element).find('.delete_section').on('click', function() {
	   self.onDelete.call(this, self.id);
	   $(self.element).fadeOut(350, function() {$(this).remove();});
	   $(self.miniView).fadeOut(350, function() {$(this).remove();});
	});

	// Attach the prompt change listener.
	$('#' + this.id + '_instructions').on('change', function() {
	    self.instructions = $(this).val();
	});
	
	/**
	 * This function helps move questions around
	 */
    $("#" + this.id + "_qsection").sortable(
      {
    	connectWith:".questionSort",
        cancel: ':input,button,[contenteditable]',
        handle: '.move_question'
      }
    ).disableSelection();
}

/**
 * Parse the template and replace the data-id attribute with the unique ID
 * of this instance.
 */
Section.prototype.parseTemplate = function() {
	  this.template = replaceAll('{{id}}', this.id, this.template);
	  this.miniViewTemplate = replaceAll('{{id}}', this.id, this.miniViewTemplate);
	  this.template = replaceAll('{{instructions}}', this.instructions, this.template);
};

/**
 * This function helps initialize the Section Object
 */
Section.prototype.init = function() { 
	this.bindEvents();
    // autosize the prompt.
	$(this.element).find('.s_instructions').autosize();
}


/**
 * Converts this Section object to a generic Object ready for JSON
 * serialization.
 * @returns {{
 *   instructions: {string},
 * }}
 */
Section.prototype.toObject = function() {
  var obj = {};

  obj.instructions = this.instructions;
  return obj;
};

/**
 * Generic question object. Other question types inherit from this question.
 * @constructor
 */
var Question = function(data) {

  /**
   * Reference to element once initiated and on-screen.
   * @type {DOMElement}
   */
  this.element = null;

  /**
   * The default number of points a quesiton is worth.
   * @type {number}
   */
  var DEFAULT_POINTS = 5;

  /**
   * The number of points this question is worth.
   * @type {number}
   */
  this.points = DEFAULT_POINTS;

  /**
   * The prompt for this question.
   * @type {string}
   */
  this.prompt = '';

  /**
   * Unique id for this instance.
   * @type {number}
   */
  this.id = 0;

  /**
   * Section number that this question belongs to
   * @type {number}
   */
  this.section = 0;
  
  /**
   * Template string that must be overwritten by each extending object.
   * @type {string}
   */
  this.template = '';

  /**
   * Point change listener.
   */
  this.onPointChange = null;

  /**
   * Delete listener.
   */
  this.onDelete = null;

  if (data) {
    this.prompt = data.prompt;
    this.points = data.points;
  }
};


/**
 * Binds the question events such as delete, prompt change, etc.
 */
Question.prototype.bindEvents = function() {
  var self = this;

  $(this.element).find('.delete_question').on('click', function() {
    self.onDelete.call(this, self.id);
    $(self.element).fadeOut(350, function() {$(this).remove();});
  });

  // Call the point change listener.
  $('#' + this.id + '_points').on('change', function() {
    self.points = parseInt($('#' + self.id + '_points').val());
    self.onPointChange.call(this);
  });

  // Attach the prompt change listener.
  $('#' + this.id + '_prompt').on('change', function() {
    self.prompt = $(this).val();
  });
}


/**
 * Parse the template and replace the data-id attribute with the unique ID
 * of this instance.
 */
Question.prototype.parseTemplate = function() {
  this.template = replaceAll('{{id}}', this.id, this.template);
  this.template = replaceAll('{{prompt}}', this.prompt, this.template);
  this.template = replaceAll('{{points}}', this.points, this.template);
};


/**
 * Perform any initialization tasks.
 */
Question.prototype.init = function() {
  this.bindEvents();

  // autosize the prompt.
  $(this.element).find('.q_prompt').autosize();

  // Set the points.
  $('#' + this.id + '_points').val(this.points);


};


/**
 * Answer object. Represents answers or choices for multiple choice and true or
 * false questions.
 * @constructor
 */
var Answer = function(answerText, value, correct) {

  /**
   * The answer text, or `True` or `False` for true/false questions.
   * @type {string}
   */
  this.answerText = answerText || '';

  /**
   * The value of this question, e.g. true or false.
   * @type {boolean}
   */
  this.value = value || false;

  /**
   * Boolean flag indicating if this answer is correct.
   * @type {boolean}
   */
  this.correct = correct || false;
};



/**
 * Multiple choice question object.
 * @constructor
 */
var MultipleChoice = function(data) {
  Question.call(this, data);

  /**
   * Array of Answer objects.
   * @type {Array.<Answer>}
   */
  if (data) {
    this.answers = data.answers; 
  } else {
    this.answers = [];
  }

  /**
   * Array of question options.
   * @type {Object}
   */
  this.options = {};

  /**
   * Flag indicating if selecting multiple answers is allowed.
   * @type {boolean}
   */
  this.options.allowMultipleCorrectAnswers = false;

  /**
   * Flag indicating if the order of choices should be randomized.
   * @type {boolean}
   */
  this.options.randomizeAnswerDisplay = false;

  // Add a single blank question only if there aren't any already loaded.
  if (this.answers.length === 0) {
    this.answers.push(new Answer('', '1'));
  }

  // Get the embedded template.
  this.template = $('#tmpl_multiplechoice').html();

  this.answerTemplate = $('#tmpl_multiplechoice_answer').html();
};
MultipleChoice.prototype = new Question();
MultipleChoice.prototype.constructor = MultipleChoice;


/**
 * Parses the answer template using the specified answer object and returns
 * the resulting string.
 * @param answer
 * @returns {*}
 */
MultipleChoice.prototype.parseAnswerTemplate = function(answer, i) {
  var tmp = this.answerTemplate;

  tmp = replaceAll('{{id}}', this.id, tmp);
  tmp = replaceAll('{{value}}', i, tmp);
  tmp = replaceAll('{{answerText}}', answer.answerText, tmp);

  return tmp;
};


/**
 * Renders the answers associated with this MultipleChoice object. Clears the
 * answers container first, before re-rendering.
 */
MultipleChoice.prototype.renderAnswers = function() {
	var self = this;
  var answersContainer = $('#' + this.id + '_answers');

  answersContainer.empty();

  for(var i = 0; i < this.answers.length; i++) {
		var num = i+1;
		var numDelete = i-1;
    var answer = this.answers[i];
    var content = $(this.parseAnswerTemplate(answer, num));

    // Check correct answers.
    $(content).find('#' + this.id + '_' + num).prop('checked', answer.correct);

    // Set the text.
    $(content).find('#' + this.id + '_' + num + '_answerText').val(answer.answerText);

    // Append the answer to the question board.
    answersContainer.append(content);
		
		// Bind the delete click.
		$('#' + this.id + '_' + num + '_choice').on('click', function(num) {
			var tempString = this.id.split('_');
			self.answers.splice(parseInt(tempString[1], 10)-1, 1);
			$('#' + this.id + '_d').fadeOut(350);
			setTimeout(function() {
				$('#' + this.id + '_d').remove();
				self.renderAnswers();
			}, 350);
		});
		
		// Bind the focusout event for choices.
		$('#' + this.id + '_' + num + '_answerText').focusout(function(num) {
			var tempString2 = this.id.split('_');
			self.answers[parseInt(tempString2[1], 10)-1] = new Answer ($(this).val(), parseInt(tempString2[1], 10));
		});

    // Bind the checkbox click.
    $(content).find('#' + this.id + '_' + answer.value).on('change', (function() {
      var a = answer;

      return function() {
        if($(this).prop('checked')) {
          a.correct = true;
        } else {
          a.correct = false;
        }
      };
    })());

    $(content).find('#' + this.id + '_' + answer.value + '_answerText').on('change', (function() {
      var a = answer;

      return function() {
        a.answerText = $(this).val();
      };
    })());
  }
};


/**
 * Adds a new blank choice to this MultipleChoice object's set of answers,
 * then re-renders the available answers.
 */
MultipleChoice.prototype.addChoice = function() {
  var answerNumber = this.answers.length + 1;
  this.answers.push(new Answer('', answerNumber));
  this.renderAnswers();
};


/**
 * Converts this MultipleChoice object to a generic Object ready for JSON
 * serialization.
 * @returns {{
 *   type:  'MultipleChoice',
 *   prompt: {string},
 *   points: {number},
 *   options: {Object},
 *   answers: [Array.<Answer>]
 * }}
 */
MultipleChoice.prototype.toObject = function() {
  var obj = {};

  obj.type = 'MultipleChoice';
  obj.prompt = this.prompt;
  obj.points = this.points;
  obj.options = this.options;
  obj.answers = this.answers;
  obj.section = this.section;

  return obj;
};


/**
 * Binds event handlers to this MultipleChoice object events.
 */
MultipleChoice.prototype.bindMultipleChoiceEvents = function() {
  var self = this;
  $('#' + this.id + '_addChoice').on('click', function() {
        self.addChoice();
    });
		
	$('#' + this.id + '_1_choice').on('click', function() {
    self.answers.splice(0, 1);
    $('#' + this.id + '_d').fadeOut(350);
		setTimeout(function() {
				$('#' + this.id + '_d').remove();
				self.renderAnswers();
			}, 350);
  });

  $('#' + this.id + '_allow_multiple').on('change', function() {
    if ($(this).prop('checked')) {
      self.options.allowMultipleCorrectAnswers = true;
    } else {
      self.options.allowMultipleCorrectAnswers = false;
    }
  });

  $('#' + this.id + '_randomize').on('change', function() {
    if ($(this).prop('checked')) {
      self.options.randomizeAnswerDisplay = true;
    } else {
      self.options.randomizeAnswerDisplay = false;
    }
  });
};


/**
 * MultipleChoice initialization routine. Called after the template has been
 * parsed and rendered on screen.
 */
MultipleChoice.prototype.init = function() {
	var self = this;
  Question.prototype.init.call(this);
  this.renderAnswers();
  this.bindMultipleChoiceEvents();
	var thisObj = this;
	$('#' + this.id + '_answers').sortable({
    handle: '.move_answer',
		axis: 'y',
		stop: function(ui, event){
        self.answers.length = 0;
				
				var tempArray = []
				$("#" + self.id + "_answers li").each(
					function(i) {
						var tempString = ($(this).attr('id')).split('_');
						var newAnswer = new Answer($("#" + tempString[0] + "_" +
																			tempString[1] + "_answerText").val(), i);
						self.answers.push(newAnswer);
        });
				self.renderAnswers();
    }
  });
};



/**
 * True/False question object.
 * @constructor
 */
var TrueFalse = function(data) {
  Question.call(this, data);

  /**
   * Array of Answer objects.
   * @type {Array.<Answer>}
   */
  this.answers = [];

  // Add the true/false answers and set `true` to be correct by default.
  this.answers.push(new Answer('True', 'true'));
  this.answers.push(new Answer('False', 'false'));

  // Get the embedded template.
  this.template = $('#tmpl_truefalse').html();

  // Get the embedded answer template.
  this.answerTemplate = $('#tmpl_truefalse_answer').html();
};
TrueFalse.prototype = new Question();
TrueFalse.prototype.constructor = TrueFalse;


/**
 * Parses the TrueFalse question template.
 */
TrueFalse.prototype.parseTemplate = function() {
  Question.prototype.parseTemplate.call(this);
};


/**
 * Parses the answer template using the specified answer object and returns
 * the resulting string.
 * @param {Answer} answer The answer object to parse.
 * @returns {string} The parsed answer template.
 */
TrueFalse.prototype.parseAnswerTemplate = function(answer) {
  var tmp = this.answerTemplate;

  tmp = replaceAll('{{id}}', this.id, tmp);
  tmp = replaceAll('{{value}}', answer.value, tmp);
  tmp = replaceAll('{{answerText}}', answer.answerText, tmp);

  return tmp;
};


/**
 * Renders this TrueFalse question's answers.
 */
TrueFalse.prototype.renderAnswers = function() {
  var answersContainer = $('#' + this.id + '_answers');

  for(var i = 0; i < this.answers.length; i++) {
    var answer = this.answers[i];
    var content = $(this.parseAnswerTemplate(answer));
    answersContainer.append(content);
  }
};


/**
 * Converts this TrueFalse object to a generic Object ready for JSON
 * serialization.
 * @returns {{
 *   type:  'TrueFalse',
 *   prompt: {string},
 *   points: {number},
 *   answers: [Array.<Answer>]
 * }}
 */
TrueFalse.prototype.toObject = function() {
  var obj = {};

  obj.type = 'TrueFalse';
  obj.prompt = this.prompt;
  obj.points = this.points;
  obj.answers = this.answers;
  obj.section = this.section;

  return obj;
};


/**
 * Binds event handlers to this TrueFalse object events.
 */
TrueFalse.prototype.bindTrueFalseEvents = function() {
  var self = this;

  $('#' + this.id + '_addChoice').on('click', function() {
    self.addChoice();
  });

  for(var i = 0; i < this.answers.length; i++) {
    var answer = this.answers[i];

    $('#' + this.id + '_' + answer.value).on('change', function() {
      self.updateAnswers();
    });
  }
};


/**
 * Event handler to update the correctness of the true and false options.
 */
TrueFalse.prototype.updateAnswers = function() {
  for(var i = 0; i < this.answers.length; i++) {
    var answer = this.answers[i];

    if ($('#' + this.id + '_' + answer.value).prop('checked')) {
      answer.correct = true;
    } else {
      answer.correct = false;
    }
  }
};


/**
 * MultipleChoice initialization routine. Called after the template has been
 * parsed and rendered on screen.
 */
TrueFalse.prototype.init = function() {
  Question.prototype.init.call(this);
  this.renderAnswers();
  this.bindTrueFalseEvents();
};



/**
 * Fill-in question object.
 * @constructor
 */
var FillIn = function(data) {
  Question.call(this, data);

  this.caretPosition = 0;

  // Get the embedded template.
  this.template = $('#tmpl_fillin').html();
};
FillIn.prototype = new Question();
FillIn.prototype.constructor = FillIn;


/**
 * Binds FillIn object events.
 */
FillIn.prototype.bindFillinEvents = function() {
  var self = this;
  $('#' + this.id + '_prompt').on('keydown click', function() {
    var textarea = document.getElementById(self.id + '_prompt');
    self.caretPosition = getCaret(textarea);
  });

  $('#' + this.id + '_add_fillin').on('click', function() {
    var textarea = document.getElementById(self.id + '_prompt');
    var val = $(textarea).val();
    val = val.splice(self.caretPosition + 1, 0, '{{fill-in-area}} ');
    $(textarea).val(val);
		self.prompt = val;
		
    // Target end of input
    var $targetInput = $('#' + self.id + '_prompt');
    var temp = $targetInput.val();
    $targetInput.focus().val(String.fromCharCode(35)).val(temp);
  });
};



/**
 * Converts this FillIn object to a generic Object ready for JSON
 * serialization.
 * @returns {{
 *   type:  'FillIn',
 *   prompt: {string},
 *   points: {number}
 * }}
 */
FillIn.prototype.toObject = function() {
  var obj = {};

  obj.type = 'FillIn';
  obj.prompt = this.prompt;
  obj.points = this.points;
  obj.section = this.section;

  return obj;
};


/**
 * FillIn initialization routine. Called after the template has been
 * parsed and rendered on screen.
 */
FillIn.prototype.init = function() {
  Question.prototype.init.call(this);
  this.bindFillinEvents();
};



/**
 * Short answer question object.
 * @constructor
 */
var ShortAnswer = function(data) {
  Question.call(this, data);

  // Get the embedded template.
  this.template = $('#tmpl_shortanswer').html();
};
ShortAnswer.prototype = new Question();
ShortAnswer.prototype.constructor = ShortAnswer;


/**
 * ShortAnswer initialization routine. Called after the template has been
 * parsed and rendered on screen.
 */
ShortAnswer.prototype.init = function() {
  Question.prototype.init.call(this);
};


/**
 * Converts this ShortAnswer object to a generic Object ready for JSON
 * serialization.
 * @returns {{
 *   type:  'ShortAnswer',
 *   prompt: {string},
 *   points: {number}
 * }}
 */
ShortAnswer.prototype.toObject = function() {
  var obj = {};

  obj.type = 'ShortAnswer';
  obj.prompt = this.prompt;
  obj.points = this.points;
  obj.section = this.section;

  return obj;
};



var appController = new function() {

  this.questions = {};

  this.sections = {};
  
  this.points = 0;

  this.goalPoints = 0;

  this.title = '';

  /**
   * Binds all the primary user interface buttons.
   */
  this.init = function() {
    var self = this;

    /******** Bind Keyboard Listeners ********/
	$(document).bind('keydown', 'ctrl+shift+1', function() {
      self.addQuestion(MultipleChoice)});
	$(document).bind('keydown', 'ctrl+shift+2', function() {
      self.addQuestion(TrueFalse)});
	$(document).bind('keydown', 'ctrl+shift+3', function() {
	      self.addQuestion(FillIn)});
	$(document).bind('keydown', 'ctrl+shift+4', function() {
	      self.addQuestion(ShortAnswer)});
	$(document).bind('keydown', 'ctrl+shift+5', function() {
	      self.addSection()});
	$(document).bind('keydown', 'ctrl+shift+q', function() {
		$("#dialog").dialog("open");
	});
	$(document).bind('keydown', 'ctrl+shift+x', function() {
		preview();
	});
	$(document).bind('keydown', 'ctrl+shift+s', function() {
		save();
	});
	$(document).bind('keydown', 'ctrl+shift+a', function() {
		switchView();
	});
	$(document).bind('keydown', 'ctrl+shift+l', function() {
       self.clearSections();
       self.loadQuiz(load());
	});
	// For closing modal with the ESC key.
	$(document).bind('keydown', 'esc', function() {
	    $("#dialog").dialog("close");
	});

    /******** Bind OnClick Listeners ********/
    $('#qt_multipleChoice').on('click', function() {
      self.addQuestion(MultipleChoice)});
    $('#qt_trueFalse').on('click', function() {
      self.addQuestion(TrueFalse)});
    $('#qt_fillIn').on('click', function() {
      self.addQuestion(FillIn)});
    $('#qt_shortAnswer').on('click', function() {
        self.addQuestion(ShortAnswer)});
    $('#qt_section').on('click', function() {
        self.addSection()});
	$(document).on("click", "#preview", function() {
		preview();
	});
	$("#help").click(function() {
		$("#dialog").dialog("open");
	});
	$("#close").click(function() {
		$("#dialog").dialog("close");
	});
    $('#save_button').on('click', function() {
    	save();
    });
    $('#load_button').on('click', function() {
       self.clearSections();
       self.loadQuiz(load());
    });
    $('#page_button').on('click', function(){
    	switchView();
    });
    
    /******** OnChange Listeners ********/
    $('#quiz_title').on('change', function() {
      self.title = $(this).val();
    });

    $('#goal_points').on('change', function() {
      self.goalPoints = $(this).val();
    });

    $('#q_page').on('change', function() {
    	mQuestionsPerPage = $(this).val();
		mPageNumber = Math.floor((mTotalQuestions-1)/mQuestionsPerPage) + 1;
    	displayPageNumbers(mPageNumber);
    	goToPage(mPageNumber);
    });
    
    $('#quiz_title').trigger('change');
    $('#goal_points').trigger('change');
  };

  /**
   * Add questions function. Adds a question of the specified type to the
   * question board and the app controller.
   * @param type The question type to be added to quiz
   */
  this.addQuestion = function(type, data, sectionId) {
    var question;

    // Create a new question of the specified type.
    if (typeof type === 'string') {
      var question = new window[type](data);
    } else {
      var question = new type(data);
    }

    if(!sectionId) {
    	sectionId = mLastSectionId;
    }

    // Generate a unique id for this question.
    question.id = (new Date()).valueOf();
    
    // Add the question to the internal questions object.
    this.questions[question.id] = question;

    // Parse the template to add the question's id.
    question.parseTemplate();

    // Append the question to the question board.
    question.element = $(question.template);

    question.onPointChange = this.updatePoints;

    question.onDelete = this.deleteQuestion;

    $('#' + sectionId + '_qsection').append(question.element);

    // Initiate the question...
    question.init();

    // Focus on question
    $('#' + question.id + "_prompt").focus();
    mTotalQuestions++;
    // update the points
    this.updatePoints();
    
    // Check if page number needs to be updated
    if(mPageNumber > 0){
        var lastPage = Math.floor((mTotalQuestions-1)/mQuestionsPerPage) + 1;
        if(mPageNumber != lastPage) {
        	goToPage(lastPage);
        	// New page created so add page number
        	$('.current_page').removeClass('current_page');
        	var liEle = $(document.createElement('li'));
        	liEle.addClass('current_page');
        	liEle.addClass('pages');
        	liEle.append('2');
            liEle.on('click', function() {
            	$('.current_page').removeClass('current_page');
            	$(this).addClass('current_page');
            	goToPage($(this).html());
            });
        	$('#page_num').append(liEle);
        }
    }
  };
  
  /**
   * Add sections function. Adds a section to the question board and the app controller
   */
  this.addSection = function(data, id) {
	  // Create a new section.
	  var section = new Section(data, id);

      // Generate a unique id for this question if new section
      if(!data) {
    	  section.id = (new Date()).valueOf();
      }
      
      // This is the newest section created
      mLastSectionId = section.id;

      // Add the section to the internal sections object.
      this.sections[section.id] = section;
      
      // Parse the template to add section's id.
      section.parseTemplate();

      // Append the section to the question board.
      section.element = $(section.template);
      $('#qs').append(section.element);
      
      // Append the mini view to the question board.
      section.miniView = $(section.miniViewTemplate);
      $('#mini_qs').append(section.miniView);
      
      // Initiate the section...
      section.init();

      $('#' + section.id + "_instructions").focus();
      $('body').animate({
          scrollTop: $('#' + section.id).offset().top
      }, 500);
      
      section.onDelete = this.deleteSection;
  }
  
  /**
   * Updates the point count.
   */
  this.updatePoints = function() {

     appController.points = 0;

     // Iterate through each question and grab the points.
     for (var q in appController.questions) {
        appController.points += appController.questions[q].points;
     }

     $('#points_total').text(appController.points);
  };

  /**
   * Delete the question and updates the total point value
   */
  this.deleteQuestion = function(questionId) {
     mTotalQuestions--;
     if(mPageNumber > 0 && mTotalQuestions != 0){
         var lastPage = Math.floor((mTotalQuestions-1)/mQuestionsPerPage) + 1;
         if(mPageNumber != lastPage) {
         	goToPage(lastPage);
         	// New page created so add page number
         	$('#page_num li:last-Child').remove();
         	$('#page_num li:last-Child').addClass('current_page');
         }
     }
     delete appController.questions[questionId];
     appController.updatePoints();
  };
  
  /**
   * This deletes the section and all the questions inside of the question
   */
  this.deleteSection = function(sectionId) {

    var idsInOrder = $('#' + sectionId + '_qsection').sortable("toArray");
    
    for (var q in idsInOrder) {
        delete appController.questions[idsInOrder[q]];
    }
    appController.updatePoints();
    delete appController.sections[sectionId];
    // Get the second last section while the last section is being deleted
	mLastSectionId = $('.section:nth-last-child(2)').last().attr('id');
	
	// Create a new section if all sections deleted
	if(!mLastSectionId) {
		appController.addSection();
	}
  };

  this.toJSON = function() {
    var obj = {};

    obj.title = this.title;
    obj.points = this.points;
    obj.goalPoints = this.goalPoints;
    obj.sections = {};
    obj.questions = {};
    
    var sectionIdsInOrder = $('#qs').sortable("toArray");
    for (var s in sectionIdsInOrder) {
 	   var questionIdsInOrder = $('#' + sectionIdsInOrder[s] + '_qsection' ).sortable("toArray");
 	   if(questionIdsInOrder.length) {
 		  obj.sections[sectionIdsInOrder[s]] = this.sections[sectionIdsInOrder[s]].toObject();
 	   }
	   for (var q in questionIdsInOrder) {
		  this.questions[questionIdsInOrder[q]].section = sectionIdsInOrder[s];
	      obj.questions[questionIdsInOrder[q]] = this.questions[questionIdsInOrder[q]].toObject();
	   }
    }
    return JSON.stringify(obj);
  };

  this.loadQuiz = function(quiz) {
    var type, q, s;
    
    var sections = quiz.sections;
    var questions = quiz.questions;
    
    for(s in sections) { 
    	this.addSection(sections[s], s);
    }
    
    for (q in questions) {
      type = questions[q].type;
      this.addQuestion(type, questions[q], questions[q].section);
    }
    $('#quiz_title').val(quiz.title);
    $('#goal_points').val(quiz.goalPoints);
  };

  this.clearSections = function() {
    $('#qs').empty();
    this.questions = {};
    this.sections = {};
  }
};

/**
 * This function helps instantiate the AppController which also binds the keyboard/click/change listeners
 */
$(window).on('ready', function() {
    $('.q_prompt').autosize();
	$('.s_instructions').autosize();
    appController.init();
    appController.addSection();
    mQuestionsPerPage = 5;
    mTotalQuestions = 0;
    
    // Display Dialog Box for Help
	$("#dialog").dialog({
		dialogClass: 'dialogFixed',
		autoOpen: false,
		resizable: false,
		modal: true,
		my: 'left',
		at: 'right',
		width: "600px",
		show: {
			effect: "fade",
			duration: 250
		},
		draggable: false,
		hide: {
			effect: "fade",
			duration: 250
		}
	});
});
