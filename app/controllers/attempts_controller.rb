class AttemptsController < ApplicationController
  before_action :set_survey, only: [:new, :create]

  def index
  end

  def new
    @attempt = Survey::Attempt.new
  end

  def create
    @participant = Survey::Participant.create(name: params[:name], email: params[:email])
    @attempt = Survey::Attempt.create(survey: @survey, participant: @participant)
    redirect_to new_survey_attempt_path(@attempt)
  end

  def show
    @attempt = Survey::Attempt.find(params[:id])
  end

  def submit
    @attempt = Survey::Attempt.find(params[:id])
    @attempt.submit
    #redirect_to checklist_report_path(@attempt, format: :pdf)
  end

  private

  def set_survey
    @survey ||= Survey::Survey.find(params[:id])
  end
end
