$(document).ready(function() {

  $(".datepicker").datepicker({
    format:'mm/dd/yyyy'
  });

  $("input[type=range]").change(function(evt) {
    var input = evt.srcElement;
    var label = $("label[for=" + input.id + "]");
    var t = label.text().split("(")[0];

    label.text(t + "(" + input.value + ")");
  });

  var options = decodeURIComponent(window.location.search.slice(1))
                                    .split('&')
                                    .reduce(function _reduce (/*Object*/ a, /*String*/ b) {
                                      b = b.split('=');
                                      a[b[0]] = b[1];
                                      return a;
                                    }, {});

  var debug = options["debug"]


  if (!debug) {
    $(".formSubmitStatus").hide();
  } else {
    // if debug == "required" then only required fields are filled in, otherwise all fields are
    $((debug == 'required') ? "form input[required][type=text]" : "form input:text").each(function() {
      if ($(this).attr("placeholder")) {
        $(this).val($(this).attr("placeholder"));
      } else {
        $(this).val("Lorem ipsum dolor sit amet");
      }
    });

    $((debug == 'required') ? "form input[required][type='number']" : "form input[type=number]").each(function() {
      if ($(this).attr("placeholder")) {
        $(this).val($(this).attr("placeholder"));
      } else {
        $(this).val("42");
      }
    });

    $((debug == 'required') ? "form input[required][type=url]" : "form input[type=url]").each(function() {
      $(this).val($(this).attr("placeholder"));
    });

    $((debug == 'required') ? "form input[required]:text.datepicker": "form input:text.datepicker").each(function() {
      $(this).val("03/12/2014")
    });

    $("form input[type=email]").each(function() {
      $(this).val($(this).attr("placeholder"));
    });

    //set test video if necessary
    $("#video").val("https://www.youtube.com/embed/C9Dlgu2Lm6U");

    var radioButtonGroups = jQuery.unique($("form input:radio").map(function() { return $(this).attr("name"); }));
    radioButtonGroups.each(function (i, v) {
      $("form input:radio[name=" + v + "]:first").attr("checked", true);
    });

    $((debug == 'required') ? "form textarea[required]" : "form textarea").each(function() {
      $(this).val("Lorem ipsum dolor sit amet, mea mazim ludus ad, harum imperdiet duo id. ");
    });

    if (debug == 'required') {
      $("form input:checkbox[name=disclose], form input:checkbox[name=truth]").each(function() {
        $(this).attr("checked", true);
      });
    } else {
      $("form input:checkbox").each(function() {
        $(this).attr("checked", true);
      });
    }

    if (debug == 'required') {
      $("select[required]").find("option:eq(1)").each(function() {
        $(this).attr('selected','selected');
      });
    } else {
      $("select").find("option:eq(1)").each(function() {
        $(this).attr('selected','selected');
      });
    }
  }

  $("textarea.allowtab").keydown(function(e) {
    if(e.keyCode === 9) { // tab was pressed
        // get caret position/selection
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);
        var value = $this.val();

        // set textarea value to: text before caret + tab + text after caret
        $this.val(value.substring(0, start)
                    + "\t"
                    + value.substring(end));

        // put caret at right position again (add one for the tab)
        this.selectionStart = this.selectionEnd = start + 1;

        // prevent the focus lose
        e.preventDefault();
    }
  });

  // set email and code to the arguement (NOTE: this should override the values from debug)
  if (options["email"] !== undefined) {
    $("form input[type=email]").val(decodeURIComponent(options["email"]));
    $("input#email").val(decodeURIComponent(options["email"]));
  }
  $("input#code").attr("value", options["code"]);


  function isDegreeChecked(degrees) {
    return function(element) {
      return degrees.some(function(s) {
        return document.getElementById("degree_" + s).checked;
      });
    }
  }

  $.validator.addMethod("notNone", function(value, element) {
    if ($(element).rules()["notNone"]) { // Only want to validate if appropriate box is checked.
      return element.value != "None";
    } else {
      return true;
    }
  }, "This field is required");

  $("#applicationForm").validate({
    rules: {
      previousAcademicWorkExperience: "number",
      previousWorkExperience: "number",
      languagesHoursClass: "number",
      languagesHours: "number",
      dataHoursReal: "number",
      dataHoursSimulation: "number",
      dataSize: "number",

      undergradInstitution: "required",
      undergradInstitutionOther: { required: function() {
        return document.getElementById("undergradInstitution").value == "Other";
      }},

      graduateInstitution: { notNone: isDegreeChecked(['PhD', 'postdoc']) },
      graduateInstitutionOther: { required: function() {
        return document.getElementById("graduateInstitution").value == "Other";
      }},
      graduateDate: { required: isDegreeChecked(['PhD', 'postdoc']) },

      masterInstitution: { notNone: isDegreeChecked(['masters']) },
      masterDate: { required: isDegreeChecked(['masters']) },
      masterInstitutionOther: { required: function() {
        return document.getElementById("masterInstitution").value == "Other";
      }},

      postdocInstitution: { notNone: isDegreeChecked(['postdoc']) },
      postdocDate: { required: isDegreeChecked(['postdoc']) },
      postdocInstitutionOther: { required: function() {
        return document.getElementById("postdocInstitution").value == "Other";
      }},
    },
    submitHandler: function(form) {
      // hack: enable email so that it can be saved
      $("#email").attr('disabled', false);

      form.submit();
    },
    invalidHandler: function(form) {
      var form = $("form");

      // Find all invalid fields within the form.
      var invalidFields = form.find( ":invalid" ).each( function(index, node) {
        // Find the field's corresponding label
        var label = $( "label[for=" + node.id + "] "),
        // Opera incorrectly does not fill the validationMessage property.
        message = node.validationMessage || 'Invalid value.';
        $(node).addClass('invalid');
      });
    }
  });

  $("#challengeForm").submit(function(form) {
    form.preventDefault();
    if (hasHtml5Validation() &&
      navigator.userAgent.indexOf("Safari") != -1) {
      if (!this.checkValidity()) {
        $(this).addClass('invalid');
        $('#status').html('invalid');
        alert("something was invalid.");
        return false;
      }
      else {
        $(this).removeClass('invalid');
        $('#status').html('submitted');
      }
    }
    $("#formSubmitSuccess").hide();
    $("#formSubmitError").hide();
    // hack: enable email so that it can be saved
    $("#email").attr('disabled', false);
    $('form #submit').attr('disabled', true);
    $('form').ajaxSubmit({
      type: "POST",
      success: function (data, text, error) {
        window.location = data;
      },
      error: function(jqXHR, text, error){
        processPossibleChallengeError(jqXHR.responseText);
        $('#formSubmitError').show();
        transitionToElem("#submit");
        $('form #submit').attr('disabled', false);
      }
    });
    return false;
  });
});



function processPossibleChallengeError(text){
  try {
    var parsed = JSON.parse(text);
    if(parsed.status == 'questionError'){
      alert("Some questions were not valid. See above for specific invalid questions.");
      parsed.errors.forEach(function(e){
        $("#" + e.name).addClass('invalid-question');
        $("#" + e.name + "-error-text").text(e.message);
        $("#" + e.name + "-error-text").show();
        $("#" + e.name).click(function(){
          $("#" + e.name + "-error-text").hide();
          $(this).removeClass('invalid-question');
        });
      });
    }
    else if(parsed.status == 'videoError'){
      alert(parsed.error);
    }
    else {
      alert("Something went wrong.");
    }
    return "Done";
  }
  catch(err) {
    return "Error";
  }
}

function hasHtml5Validation () {
    return typeof document.createElement('input').checkValidity === 'function';
}
