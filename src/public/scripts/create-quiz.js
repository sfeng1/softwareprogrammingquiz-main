let questionNumber = 0;
$(document).ready(function() {
    $("#submit").on("click", function() {
        if (!confirm("Submit quiz?")) return false
    })
    $("#add-tf").on("click", function() {
        questionNumber += 1;
        const tfinput = ` 
            <div class="form-label" id="question${questionNumber}">
                <h3 id="questionNum"> Question ${questionNumber} </h3>
                <h4> True/False </h4>

                <b> Question </b>
                <div class="div-margin">
                    <input type="text" class="form-control w-75" id="tf-question${questionNumber}-question" name="question${questionNumber}-question" placeholder="Enter Question Here" required> 
                </div>
                
                <b> Question Points </b>
                <div class="div-margin">
                    <input type="number" class="form-control w-25" id="tf-question${questionNumber}-points" name="question${questionNumber}-points" placeholder="Point(s)" required> 
                </div>
                
                <b> Answer </b> <br>
                <div>
                    <input type="radio" id="tf-question${questionNumber}-answer" name="question${questionNumber}-answer" value="True" required>
                    <label for="question${questionNumber}-answer"> T </label> 
                </div>

                <div class="div-margin">
                    <input type="radio" id="tf-question${questionNumber}-answer" name="question${questionNumber}-answer" value="False" required>
                    <label for="question${questionNumber}-answer"> F </label>
                </div
                <br>

                <input type="hidden" aria-label="question_number" id="question_${questionNumber}" name="question_number" value="${questionNumber}">
                <input type="hidden" aria-label="question_type" id="question${questionNumber}-type" name="question_type" value="TF">

                <button type="button" class="btn btn-danger del-btn" id="delete"> Delete Question </button>
            </div>`
        $("#questions").append(tfinput);
    });
    
    $("#add-mc").on("click", function() {
        questionNumber += 1
        const mcinput = `
        <div class="form-label" id="question${questionNumber}">
            <h3 id="questionNum"> Question ${questionNumber} </h3>
            <h4> Multiple Choice </h4>

            <b> Question </b>
            <div class="div-margin">
                <input type="text" class="form-control w-75" id="mc-question${questionNumber}-question" name="question${questionNumber}-question" placeholder="Enter Question here" required>
            </div>
            
            <b> Choices and Point Values </b>
            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="mc-question${questionNumber}-option1" name="question${questionNumber}-option1" style="margin-right: 10px;" placeholder="Choice 1" required>
                <input type="number" class="form-control w-25" id="mc-question${questionNumber}-choice1-value" name="question${questionNumber}-choice1-value" placeholder="Point Value" value="0" required>
            </div>
            
            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="mc-question${questionNumber}-option2" name="question${questionNumber}-option2" placeholder="Choice 2" required>
                <input type="number" class="form-control w-25" id="mc-question${questionNumber}-choice2-value" name="question${questionNumber}-choice2-value" placeholder="Point Value" value="0" required>
            </div>
            
            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="mc-question${questionNumber}-option3" name="question${questionNumber}-option3" placeholder="Choice 3" required>
                <input type="number" class="form-control w-25" id="mc-question${questionNumber}-choice3-value" name="question${questionNumber}-choice3-value" placeholder="Point Value" value="0" required>
            </div>

            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="mc-question${questionNumber}-option4" name="question${questionNumber}-option4" placeholder="Choice 4" required>
                <input type="number" class="form-control w-25" id="mc-question${questionNumber}-choice4-value" name="question${questionNumber}-choice4-value" placeholder="Point Value" value="0" required>
            </div>

            
            <input type="hidden" aria-label="question_number" id="question_${questionNumber}" name="question_number" value="${questionNumber}">
            <input type="hidden" aria-label="question_type" id="question${questionNumber}-type" name="question_type" value="MC">
            
            <button type="button" class="btn btn-danger del-btn" id="delete"> Delete Question </button>
        </div>`
        $("#questions").append(mcinput)
    })

    $("#add-select").on("click", function() {
        questionNumber += 1
        const mcinput = `
        <div class="form-label" id="question${questionNumber}">
            <h3 id="questionNum"> Question ${questionNumber} </h3>
            <h4> Select All that Apply </h4> 

            <b> Question </b>
            <div class="div-margin">
                <input type="text" class="form-control w-75" id="cb-question${questionNumber}-question" name="question${questionNumber}-question" placeholder="Enter Question here" required>
            </div>

            <label for="question${questionNumber}-question"> </label>
            
            <b> Choices and Point Values </b>
            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="cb-question${questionNumber}-option1" name="question${questionNumber}-option1" placeholder="Choice 1" required>
                <input type="number" class="form-control w-25" id="cb-question${questionNumber}-choice1-value" name="question${questionNumber}-choice1-value" placeholder="Point Value" value="0" required>
            </div>

            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="cb-question${questionNumber}-option2" name="question${questionNumber}-option2" placeholder="Choice 2" required>
                <input type="number" class="form-control w-25" id="cb-question${questionNumber}-choice2-value" name="question${questionNumber}-choice2-value" placeholder="Point Value" value="0" required>
            </div>

            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="cb-question${questionNumber}-option3" name="question${questionNumber}-option3" placeholder="Choice 3" required>
                <input type="number" class="form-control w-25" id="cb-question${questionNumber}-choice3-value" name="question${questionNumber}-choice3-value" placeholder="Point Value" value="0" required>
            </div>

            <div class="input-div div-margin">
                <input type="text" class="form-control w-50 input-margin" id="cb-question${questionNumber}-option4" name="question${questionNumber}-option4" placeholder="Choice 4" required>
                <input type="number" class="form-control w-25" id="cb-question${questionNumber}-choice4-value" name="question${questionNumber}-choice4-value" placeholder="Point Value" value="0" required>
            </div>

            
            <input type="hidden" aria-label="question_number" id="question_${questionNumber}" name="question_number" value="${questionNumber}">
            <input type="hidden" aria-label="question_type" id="question${questionNumber}-type" name="question_type" value="CB">
            
            <button type="button" class="btn btn-danger del-btn" id="delete"> Delete Question </button>
            </div>`
        $("#questions").append(mcinput)
    })

    $("#add-freeform").on("click", function() {
        questionNumber += 1;
        const freeforminput = `
        <div class="form-label" id="question${questionNumber}"> 
            <h3 id="questionNum"> Question ${questionNumber} </h3>
            <h4> Free Respsonse </h4>

            <b> Question </b>
            <div class="div-margin">
            <input type="text" class="form-control w-75" id="fr-question${questionNumber}-question" name="question${questionNumber}-question" placeholder="Enter Question Here" required> 
            </div>
            
            <button type="button" class="btn btn-danger del-btn" id="delete"> Delete Question </button>

            <input type="hidden" aria-label="question_number" id="question_${questionNumber}" name="question_number" value="${questionNumber}">
            <input type="hidden" aria-label="question_type" id="question${questionNumber}-type" name="question_type" value="FR">

        </div>`;
        $("#questions").append(freeforminput);
    });
    
    $("#questions").on("click", "#delete", function() {
        if (confirm("Delete Question?")) {
            $(this).parent().remove()
            let elms = $("#questions").children().length
            let body = $("#questions").children()
            
            // renumbering logic
            for (i = 1; i < elms + 1; i++){
                let div = body[i]
                $(div).children("h3").each(function() {
                    $(this).replaceWith(`<h3 id="questionNum${i}"> Question ${i} </h3>`)
                })
                
                
                $(div).children("div").each(function() {
                    $(this).children("label").each(function() {
                        if ($(this).attr("for").includes("-answer")) {
                            $(this).attr("for", `question${i}-answer` )
                        }
                        
                        if ($(this).attr("for").includes("-question")) {
                            $(this).attr("for", `question${i}-question` )
                        }
                        
                        if ($(this).attr("for").includes("-points")) {
                            $(this).attr("for", `question${i}-points` )
                        }
                    })
                    $(this).children("input").each(function() {
                        // TF INPUT CHANGES
                        if ($(this).attr("id").includes("tf")) {
                            if ($(this).attr("id").includes("tf-question") && $(this).attr("name").includes("-question")) {
                                $(this).attr("id", `tf-question${i}-question`)
                                $(this).attr("name", `question${i}-question`)
                            }
            
                            if ($(this).attr("id").includes("tf-question") && $(this).attr("name").includes("-points")) {
                                $(this).attr("id", `tf-question${i}-points`)
                                $(this).attr("name", `question${i}-points`)
                            }
            
                            if ($(this).attr("id").includes("tf-question") && $(this).attr("name").includes("-answer")) {
                                $(this).attr("id", `tf-question${i}-answer`)
                                $(this).attr("name", `question${i}-answer`)
                            }
                        } else if ($(this).attr("id").includes("mc")) {
                            // MC INPUT CHANGES
                            if ($(this).attr("id").includes("mc-question") && $(this).attr("name").includes("-question")) {
                                $(this).attr("id", `mc-question${i}-question`)
                                $(this).attr("name", `question${i}-question`)
                            }
                            
                            if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("option1")) {
                                $(this).attr("id", `mc-question${i}-option1`)
                                $(this).attr("name",`question${i}-choice1`)
                            } else if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("option2")) {
                                $(this).attr("id", `mc-question${i}-option2`)
                                $(this).attr("name",`question${i}-choice2`)
                            } else if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("option3")) {
                                $(this).attr("id", `mc-question${i}-option3`)
                                $(this).attr("name",`question${i}-choice3`)
                            } else if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("option4")) {
                                $(this).attr("id", `mc-question${i}-option4`)
                                $(this).attr("name",`question${i}-choice4`)
                            }
                            
                            if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("choice1-value")) {
                                $(this).attr("id", `mc-question${i}-choice1-value`)
                                $(this).attr("name",`question${i}-choice1-value`)
                            } else if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("choice2-value")) {
                                $(this).attr("id", `mc-question${i}-choice2-value`)
                                $(this).attr("name",`question${i}-choice2-value`)
                            } else if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("choice3-value")) {
                                $(this).attr("id", `mc-question${i}-choice3-value`)
                                $(this).attr("name",`question${i}-choice3-value`)
                            } else if ($(this).attr("id").includes("mc-question") && $(this).attr("id").includes("choice4-value")) {
                                $(this).attr("id", `mc-question${i}-choice4-value`)
                                $(this).attr("name",`question${i}-choice4-value`)
                            }
                        } else if ($(this).attr("id").includes("cb")) {
                            // CB/SELECT ALL INPUT CHANGES
                            if ($(this).attr("id").includes("cb-question") && $(this).attr("name").includes("-question")) {
                                $(this).attr("id", `cb-question${i}-question`)
                                $(this).attr("name", `question${i}-question`)
                            }
                            
                            if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("option1")) {
                                $(this).attr("id", `cb-question${i}-option1`)
                                $(this).attr("name",`question${i}-choice1`)
                            } else if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("option2")) {
                                $(this).attr("id", `cb-question${i}-option2`)
                                $(this).attr("name",`question${i}-choice2`)
                            } else if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("option3")) {
                                $(this).attr("id", `cb-question${i}-option3`)
                                $(this).attr("name",`question${i}-choice3`)
                            } else if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("option4")) {
                                $(this).attr("id", `cb-question${i}-option4`)
                                $(this).attr("name",`question${i}-choice4`)
                            }
                            
                            if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("choice1-value")) {
                                $(this).attr("id", `cb-question${i}-choice1-value`)
                                $(this).attr("name",`question${i}-choice1-value`)
                            } else if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("choice2-value")) {
                                $(this).attr("id", `cb-question${i}-choice2-value`)
                                $(this).attr("name",`question${i}-choice2-value`)
                            } else if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("choice3-value")) {
                                $(this).attr("id", `cb-question${i}-choice3-value`)
                                $(this).attr("name",`question${i}-choice3-value`)
                            } else if ($(this).attr("id").includes("cb-question") && $(this).attr("id").includes("choice4-value")) {
                                $(this).attr("id", `cb-question${i}-choice4-value`)
                                $(this).attr("name",`question${i}-choice4-value`)
                            }
                        } else if ($(this).attr("id").includes("fr")) {
                            // FREE RESPONSE INPUT CHANGE
                            if ($(this).attr("id").includes("fr-question")) {
                                $(this).attr("id", `fr-question${i}-question`)
                                $(this).attr("name", `question${i}-question`)
                            }
                        }
                    })
                })
                $(div).children("input").each(function() {
                    if ($(this).attr("id").includes("question_")) {
                        $(this).attr("id", `"question_${i}"`)
                        $(this).attr("value", `${i}`)
                    }
                    
                    if ($(this).attr("name").includes("_number")) {
                        $(this).attr("value", `${i}`)
                    }
    
                    if ($(this).attr("id").includes("-type")) {
                        $(this).attr("id", `question${i}-type`)
                    }
                })
    
                $(div).attr("id", `${i}`)
            }
            questionNumber = elms - 1
        }
    }) 

    return false;
});