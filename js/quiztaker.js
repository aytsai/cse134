var MAX_NAV_QUESTIONS = 5;	// Maximum number of questions that can fit in navigation bar
var totalQuestions = 0;		// Total number of questions on the quiz


/**
 * This function will load the questions stored in JSON onto the preview
 * Also binds other events
 */
$(document).ready(function() {
	var json = window.localStorage.getItem('savedQuiz');
	var quiz = JSON.parse(json);
	var sections = quiz.sections;
	var questions = quiz.questions;
	$('#quiz_title').html(quiz.title);
	var firstQuestion = true;
	for(var s in sections) { 
		addSection(sections[s], s);
		if(!firstQuestion) {
			$('#' + s + '_section').prepend('<hr>');
		} else {
			firstQuestion = false;
		}
	}
	
	for(var q in questions) {
		var question = questions[q];
		var type = question.type;
		
		totalQuestions++;
		
		// Add question onto the page based on question type.
		if(type == 'MultipleChoice') {
			addMultipleChoiceQuestion(question, totalQuestions);
		} else if(type == 'TrueFalse') {
			addTrueFalseQuestion(question, totalQuestions);
		} else if(type == 'FillIn') {
			addFillInQuestion(question, totalQuestions);
		} else if(type == 'ShortAnswer') {
			addShortAnswerQuestion(question, totalQuestions);
		} 
		
		// Add the question onto navigation bar
		if(totalQuestions <= MAX_NAV_QUESTIONS) {
			addQuestionOntoNavBar(totalQuestions);
		}
	}
	$('#totalQuestions').html(totalQuestions);
	
	// Add binding to auto grow input text fields
	$('.fillInTextBox').autoGrowInput({
    comfortZone: 40,
    minWidth: 150,
    maxWidth: 1000
  });
	
	$('#sections div input').change(function() {
			if($(this).parent().parent().parent().attr("class") == "trueFalse") { // true false
				var currId = $(this).parent().parent().parent().children("p").attr("id");
				var navId = currId.replace('q', '');
				$("#" + currId).data("hasAnswer", 1);
				$('#qb' + navId).parent("li").addClass('answered_question');
			}
			else if ($(this).parent().parent().attr("class") == "fillIn") { // fill in
				var currId = $(this).parent().parent().children("p").attr("id");
				var navId = currId.replace('q', '');
				if ($(this).val()) {
						$("#" + currId).data("hasAnswer", 1);
						$('#qb' + navId).parent("li").addClass('answered_question');
				}
				else {
						$("#" + currId).data("hasAnswer", 0);
						$('#qb' + navId).parent("li").removeClass('answered_question');
				}
			}
			else { // multiple choice
				var currId = $(this).parent().parent().parent().parent().children("p").attr("id");
				var navId = currId.replace('q', '');
				$("#" + currId).data("hasAnswer", 1);
				$('#qb' + navId).parent("li").addClass('answered_question');
			}
			howManyAnswers();
	});
	
	$('#sections div textarea').change(function() { // short answer
			var currId = $(this).parent().children("p").attr("id");
			var navId = currId.replace('q', '');
			if ($(this).val()) {
					$("#" + currId).data("hasAnswer", 1);
					$('#qb' + navId).parent("li").addClass('answered_question');
			}
			else {
					$("#" + currId).data("hasAnswer", 0);
					$('#qb' + navId).parent("li").removeClass('answered_question');
			}
			howManyAnswers();
	});
});

function howManyAnswers() {
	var answered = 0;
	$("#sections").children("div").children("div").each (function() {
			if ($(this).children("p").data("hasAnswer") == 1) {
				answered++;
			}
	});
	$("#answeredQuestions").html(answered);
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
 * Helper function to help add a divider onto the preview
 */
function addSection(section, id) { 
	var sectionTemplate = $('#tmpl_section').html();
	sectionTemplate = replaceAll('{{id}}', id, sectionTemplate);
	sectionTemplate = replaceAll('{{instructions}}', section.instructions, sectionTemplate); 
	$('#sections').append(sectionTemplate);
}

/**
 * Helper function to help add multiple choice question onto the preview.
 * @param {Object} question Question taken from JSON to add to preview
 * @param {int} questionNumber
 */
function addMultipleChoiceQuestion(question, questionNumber) { 
	var questionTemplate = $('#tmpl_multiplechoice').html();
	var answerTemplate = $('#tmpl_multiplechoice_answer').html();
	questionTemplate = replaceAll('{{question_prompt}}', question.prompt, questionTemplate);
	questionTemplate = replaceAll('{{id}}', questionNumber, questionTemplate);
	$('#' + question.section + '_section').append(questionTemplate);
	for(var a in question.answers) { 
		var answer = question.answers[a]; 
		var tmp = replaceAll('{{answer}}', answer.answerText, answerTemplate);
		tmp = replaceAll('{{id}}', questionNumber, tmp);
		$('#ans' + questionNumber).append(tmp);
	}
}

/**
 * Helper function to help add true false question onto the preview.
 * @param {Object} question Question taken from JSON to add to preview
 * @param {int} questionNumber
 */
function addTrueFalseQuestion(question, questionNumber) { 
	var questionTemplate = $('#tmpl_truefalse').html();
	questionTemplate = replaceAll('{{question_prompt}}', question.prompt, questionTemplate);
	questionTemplate = replaceAll('{{id}}', questionNumber, questionTemplate);
	$('#' + question.section + '_section').append(questionTemplate);
}

/**
 * Helper function to help add fill in question onto the preview.
 * @param {Object} question Question taken from JSON to add to preview
 * @param {int} questionNumber
 */
function addFillInQuestion(question, questionNumber) { 
	var questionTemplate = $('#tmpl_fillin').html();
	var textBoxCode = $('#tmpl_fillintextbox').html();
	questionTemplate = replaceAll('{{question_prompt}}', question.prompt, questionTemplate);
	questionTemplate = replaceAll('{{id}}', questionNumber, questionTemplate);
	textBoxCode = replaceAll('{{id}}', questionNumber, textBoxCode);
	questionTemplate = replaceAll('{{fill-in-area}}', textBoxCode, questionTemplate);
	$('#' + question.section + '_section').append(questionTemplate);
}

/**
 * Helper function to help add short answer question onto the preview.
 * @param {object} question Question taken from JSON to add to preview
 * @param {int} questionNumber
 */
function addShortAnswerQuestion(question, questionNumber) { 
	var questionTemplate = $('#tmpl_shortanswer').html();
	questionTemplate = replaceAll('{{question_prompt}}', question.prompt, questionTemplate);
	questionTemplate = replaceAll('{{id}}', questionNumber, questionTemplate);
	$('#' + question.section + '_section').append(questionTemplate);
}

$(document).on("click", "#up", function() { 
	previousQuestions() });

$(document).on("click", "#down", function() { 
	nextQuestions() });

/**
 * Helper function to help go back to previous 5 questions on the navigation bar.
 * @param {int} questionNumber The number of the question to be added
 */
function previousQuestions() {
	var lastQuestion = parseInt($('#nav1 > a > span').html()) - MAX_NAV_QUESTIONS;
	if(lastQuestion > 0) { 
		$('#down').show();
		for( i = 0; i < MAX_NAV_QUESTIONS; i++) {
			$('#qb' + (lastQuestion + i + MAX_NAV_QUESTIONS)).removeClass('marked');
			$('#nav' + (i+1)).removeClass('answered_question');
			addQuestionOntoNavBar(lastQuestion + i);
		}
		if(lastQuestion - MAX_NAV_QUESTIONS < 1) {
			$('#up').hide();
		}
	} 
}

/**
 * Helper function to help go forward to next 5 questions on the navigation bar.
 * @param {int} questionNumber The number of the question to be added
 */
function nextQuestions() { 
	var lastQuestion = parseInt($('#nav1 > a > span').html()) + MAX_NAV_QUESTIONS;
	if(lastQuestion <= totalQuestions) { 
		$('#up').show();
		for( i = 0; i < MAX_NAV_QUESTIONS; i++) {
			$('#qb' + (lastQuestion + i - MAX_NAV_QUESTIONS)).removeClass('marked');
			$('#nav' + (i+1)).removeClass('answered_question');
			addQuestionOntoNavBar(lastQuestion + i);
		}
		if(lastQuestion + MAX_NAV_QUESTIONS > totalQuestions) {
			$('#down').hide();
		}
	}
}

/**
 * Helper function to help display a question onto the nav bar
 * @param {int} questionNumber The number of the question to be added
 */
function addQuestionOntoNavBar(questionNumber) {
	var navId = '#nav' + (((questionNumber-1) % MAX_NAV_QUESTIONS) + 1);
	if ($('#q' + questionNumber).length ) {
		var questionType = $('#q' + questionNumber).closest('div').attr('class');
		$(navId).addClass('qt_' + questionType);
		$(navId).removeClass("blank");
		$(navId + ' > a').html('Question <span>' + questionNumber + '</span>');
		$(navId + ' > a').attr('href', '#p' + questionNumber);
		$(navId + ' > span:first-of-type').attr('id', 'qb' + questionNumber);
		if ($('#q' + questionNumber + 'check > img.bookmarkedImg').is(':visible')) {
				$('#qb' + questionNumber).addClass('marked');
		}
		if ($('#q' + questionNumber).data("hasAnswer")) {
				$(navId).addClass('answered_question');
		}
	} else {
		$(navId + ' > a').html('&nbsp;');
		$(navId).removeClass();
		$(navId).addClass("blank");
		$(navId + ' > span:first-of-type').removeAttr('id');
	}
}


$(document).on("click", ".bookmarkImg", function() { 
	$(this).hide();
	$(this).siblings('.bookmarkedImg').show();
	var id = $(this).attr('alt');
	$('#qb' + id).addClass('marked');
});

$(document).on("click", ".bookmarkedImg", function() { 
	$(this).hide();
	$(this).siblings('.bookmarkImg').show();
	var id = $(this).attr('alt');
	$('#qb' + id).removeClass('marked');
});


/**
 * Function for expanding text fields
 */
(function($){

$.fn.autoGrowInput = function(o) {

    o = $.extend({
        maxWidth: 1000,
        minWidth: 0,
        comfortZone: 70
    }, o);

    this.filter('input:text').each(function(){

        var minWidth = o.minWidth || $(this).width(),
            val = '',
            input = $(this),
            testSubject = $('<tester/>').css({
                position: 'absolute',
                top: -9999,
                left: -9999,
                width: 'auto',
                fontSize: input.css('fontSize'),
                fontFamily: input.css('fontFamily'),
                fontWeight: input.css('fontWeight'),
                letterSpacing: input.css('letterSpacing'),
                whiteSpace: 'nowrap'
            }),
            check = function() {

                if (val === (val = input.val())) {return;}

                // Enter new content into testSubject
                var escaped = val.replace(/&/g, '&amp;').replace(/\s/g,' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                testSubject.html(escaped);

                // Calculate new width + whether to change
                var testerWidth = testSubject.width(),
                    newWidth = (testerWidth + o.comfortZone) >= minWidth ? testerWidth + o.comfortZone : minWidth,
                    currentWidth = input.width(),
                    isValidWidthChange = (newWidth < currentWidth && newWidth >= minWidth)
                                         || (newWidth > minWidth && newWidth < o.maxWidth);

                // Animate width
                if (isValidWidthChange) {
                    input.width(newWidth);
                }

            };

        testSubject.insertAfter(input);

        $(this).bind('keyup keydown blur update', check);

    });

    return this;

};

})(jQuery);

$(document).bind('keydown', 'esc', function() {
	  $("#dialog").dialog("close");
});
	
/** 
 * Recenters dialog when window is resized. 
 */
$(window).resize(function(){
    $(".ui-dialog-content").dialog("option","position","center");
});

// Initialize dialog box.
$("#dialog").dialog({
		dialogClass: 'dialogFixed',
		autoOpen: false,
		resizable: false,
		modal: true,
		my: 'left',
		at: 'right',
		height: 105,
		width: 600,
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

// Bind dialog events
$("#help").click(function() {
			$("#dialog").dialog("open");
});
$("#close").click(function() {
		$("#dialog").dialog("close");
});
