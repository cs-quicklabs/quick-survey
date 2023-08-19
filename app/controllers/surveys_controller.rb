class SurveysController < ApplicationController
  before_action :set_survey, only: [:edit, :update, :destroy, :show, :clone, :archive_survey, :unarchive_survey]

  def index
    authorize :Survey
    @title = "Home"
    surveys = Survey::Survey.all.active.where(folder_id: nil)
    @pagy, @surveys = pagy_nil_safe(params, surveys, items: LIMIT)
    render_partial("surveys/survey", collection: @surveys, cached: true) if stale?(@surveys)
  end

  def new
    authorize :Survey

    @survey = Survey::Survey.new
  end

  def edit
    authorize :Survey
  end

  def destroy
    authorize :Survey

    @survey.destroy
    redirect_to surveys_path, status: 303, notice: "Survey has been deleted."
  end

  def update
    authorize :Survey

    @survey.update(survey_params)
    redirect_to survey_path(@survey)
  end

  def create
    authorize :Survey
    @survey = Survey::Survey.new(survey_params)
    @survey.user = current_user
    if @survey.save
      if @survey.folder_id.present?
        @folder = Folder.find(@survey.folder_id)
        redirect_to space_folder_path(@folder.space, @folder) and return
      else
        redirect_to survey_path(@survey)
      end
    end
  end

  def show
    authorize :Survey
    @question = Survey::Question.new
  end

  def clone
    authorize :Survey

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

  def archived
    authorize :survey, :index?

    surveys = Survey::Survey.inactive.order(archived_on: :desc)
    @pagy, @surveys = pagy_nil_safe(params, surveys, items: LIMIT)

    render_partial_as("surveys/archived_survey", collection: @surveys, as: :survey, cached: true) if stale?(@surveys)
  end

  def archive_survey
    authorize :survey, :update?

    @survey.update(active: false, archived_on: DateTime.now.utc)
    redirect_to archived_surveys_path, notice: "Survey has been archived."
  end

  def unarchive_survey
    authorize :survey, :update?
    @survey.update(active: true, archived_on: nil)
    redirect_to survey_path(@survey), notice: "Survey has been restored."
  end

  private

  def set_survey
    @survey = Survey::Survey.find(params[:id])
  end

  def survey_params
    params.require(:survey_survey).permit(:name, :survey_type, :description, :folder_id)
  end
end
