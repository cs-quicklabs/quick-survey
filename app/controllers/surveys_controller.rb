class SurveysController < ApplicationController
  before_action :set_survey, only: [:edit, :update, :destroy, :show]

  def index
    @title = "Home"
    @surveys = Survey::Survey.all
  end

  def new
    @survey = Survey::Survey.new
  end

  def edit
  end

  def destroy
  end

  def update
  end

  def create
    @survey = Survey::Survey.new(survey_params)
    binding.irb
    redirect_to(:action => :index) if @survey.save
  end

  def show
  end

  private

  def set_survey
    @survey = Survey::Survey.find(params[:id])
  end

  def survey_params
    params.require(:survey_survey).permit(:name, :survey_type, :description)
  end
end
