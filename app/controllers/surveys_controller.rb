class SurveysController < ApplicationController
  before_action :set_survey, only: [:edit, :update, :destroy, :show, :clone]

  def index
    authorize :Survey
    @title = "Home"
    @pagy, @surveys = pagy_nil_safe(params, Survey::Survey.all, items: LIMIT)
    render_partial("surveys/survey", collection: @surveys, cached: true) if stale?(@surveys)
  end

  def new
    @survey = Survey::Survey.new
  end

  def edit
  end

  def destroy
    @survey.destroy
    redirect_to surveys_path, status: 303, notice: "Survey has been deleted."
  end

  def update
    @survey.update(survey_params)
    redirect_to survey_path(@survey)
  end

  def create
    @survey = Survey::Survey.new(survey_params)
    redirect_to survey_path(@survey) if @survey.save
  end

  def show
    @question = Survey::Question.new
  end

  def clone
    @clone = Survey::Survey.new
    @clone.name = @survey.name + " (Copy)"
    @clone.survey_type = @survey.survey_type
    @clone.description = @survey.description.nil? ? "N/A" : @survey.description
    @clone.save

    @survey.questions.each do |question|
      q = Survey::Question.new(text: question.text, description: question.description, survey_id: @clone.id)
      q.save

      if @survey.survey_type == 0 #checklist
        Survey::Option.new(text: "Yes", question: q, correct: true, weight: 1).save
        Survey::Option.new(text: "No", question: q, correct: false, weight: 0).save
      else
        Survey::Option.new(text: "Score", question: q, correct: true, weight: 10).save
      end
    end

    redirect_to survey_path(@clone)
  end

  private

  def set_survey
    @survey = Survey::Survey.find(params[:id])
  end

  def survey_params
    params.require(:survey_survey).permit(:name, :survey_type, :description, :survey_stage)
  end
end
