class BaseController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_account!
  after_action :verify_authorized

  LIMIT = 30

  def authenticate_account!
    raise Pundit::NotAuthorizedError unless current_user.account == Current.account
  end

  private

  def add_options(question, survey)
    if survey.survey_type == 0 #checklist
      Survey::Option.new(text: "Yes", question: question, correct: true, weight: 1).save
      Survey::Option.new(text: "No", question: question, correct: false, weight: 0).save
    elsif survey.survey_type == 1 #score
      Survey::Option.new(text: "Score", question: question, correct: true, weight: 10).save
    elsif survey.survey_type == 2 #mark
      Survey::Option.new(text: "Yes", question: question, correct: true, weight: 1).save
    end
  end
end
