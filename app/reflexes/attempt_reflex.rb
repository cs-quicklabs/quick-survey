# frozen_string_literal: true

class AttemptReflex < ApplicationReflex
  def answer
    @attempt = Survey::Attempt.find(element.dataset[:attempt_id])
    @question = Survey::Question.find(element.dataset[:question_id])
    @option = Survey::Option.find(element.dataset[:option_id])
    Survey::Answer.create(attempt: @attempt, question: @question, option: @option)
  end
end
