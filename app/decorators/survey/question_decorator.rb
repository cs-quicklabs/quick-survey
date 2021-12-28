class Survey::QuestionDecorator < Draper::Decorator
  delegate_all

  def display_description
    description.nil? ? "" : description.upcase_first
  end

  def display_explanation
    explanation.nil? ? "" : explanation.upcase_first
  end

  def display_category
    question_category.nil? ? "" : question_category.name.capitalize
  end

  def display_text
    text.nil? ? "" : text.upcase_first
  end
end
