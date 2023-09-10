class Survey::Question < ActiveRecord::Base
  self.table_name = "survey_questions"

  #acceptable_attributes :text, :survey, :options_attributes => Survey::Option::AccessibleAttributes

  # relations
  belongs_to :survey
  has_many :options, :dependent => :destroy
  accepts_nested_attributes_for :options,
    :reject_if => ->(a) { a[:text].blank? },
    :allow_destroy => true

  # validations
  validates :text, :presence => true, :allow_blank => false, on: :create

  def correct_options
    return options.correct
  end

  def incorrect_options
    return options.incorrect
  end

  def attempted_option(attempt)
    answer = attempted_answer(attempt)
    return nil if answer.nil?

    option_id = answer.option_id
    Survey::Option.find(option_id)
  end

  def attempted_answer(attempt)
    attempt.answers.select { |a| a.question_id == id }.first
  end

  def marked_score(attempt)
    answer = attempted_answer(attempt)
    return 0 if answer.nil?

    answer.score
  end
end
