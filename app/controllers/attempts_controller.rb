class AttemptsController < ApplicationController
  before_action :set_survey, only: [:new, :create]

  def index
      @attempts = Survey::Attempt.includes(:participant, :survey).order(updated_at: :desc).all   
      @pagy, @attempts =  pagy( @attempts, items: 10)
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
    if @attempt.survey.survey_type == 0
      redirect_to checklist_report_path(@attempt)
    else
      redirect_to score_report_path(@attempt)
    end
  end

  private

  def set_survey
    @survey ||= Survey::Survey.find(params[:id])
  end
end
