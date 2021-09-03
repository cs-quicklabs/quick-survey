# frozen_string_literal: true

class AttemptReflex < ApplicationReflex
  def answer
    attempt = Survey::Attempt.find(element.dataset[:attempt_id])
    question = Survey::Question.find(element.dataset[:question_id])
    option = Survey::Option.find(element.dataset[:option_id])
    answer = Survey::Answer.find_by(attempt: attempt, question: question)
    if answer
      answer.update_attribute(:option_id, element.dataset[:option_id])
    else
      Survey::Answer.create(attempt: attempt, question: question, option: option)
    end

    morph "#{dom_id(question)}", render(partial: "attempts/checklist_question", locals: { attempt: attempt, question: question, option: option })
  end

  def score
    attempt = Survey::Attempt.find(element.dataset[:attempt_id])
    question = Survey::Question.find(element.dataset[:question_id])
    option = Survey::Option.find(element.dataset[:option_id])

    answer = Survey::Answer.find_by(attempt: attempt, question: question, option: option)
    if answer
      answer.update(score: element.dataset[:score].to_i)
    else
      Survey::Answer.create(attempt: attempt, question: question, option: option, correct: true, score: element.dataset[:score].to_i)
    end

    morph "#{dom_id(question)}", render(partial: "attempts/score_question", locals: { attempt: attempt, question: question, option: option })
  end
end
