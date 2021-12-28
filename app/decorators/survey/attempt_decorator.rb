class Survey::AttemptDecorator < Draper::Decorator
  delegate_all

  def display_score
    if survey.checklist?
      "#{score.to_s}/#{survey.questions.count.to_s}"
    else
      score.to_s + "%"
    end
  end
end
