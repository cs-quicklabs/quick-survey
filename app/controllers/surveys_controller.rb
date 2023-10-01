class SurveysController < BaseController
  include Pagy::Backend

  before_action :set_survey, only: [:edit, :update, :destroy, :show, :clone, :archive_survey, :unarchive_survey, :pin, :unpin]
  before_action :find_survey, only: [:attempts]

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
    authorize @survey
  end

  def destroy
    authorize @survey

    if DestroySurvey.call(@survey).result
      redirect_to surveys_path, status: 303, notice: "Survey has been deleted."
    end
  end

  def update
    authorize :Survey
    respond_to do |format|
      if @survey.update(survey_params)
        format.html { redirect_to survey_path(@survey), notice: "Survey was successfully updated." }
      else
        format.html { redirect_to edit_survey_path(@survey), notice: "Failed to update survey." }
      end
    end
  end

  def create
    authorize :Survey
    @survey = Survey::Survey.new(survey_params)
    @survey.user = current_user

    respond_to do |format|
      if @survey.save
        if @survey.folder_id.present?
          @folder = Folder.find(@survey.folder_id)
          format.html { redirect_to space_folder_path(@folder.space, @folder), notice: "Survey was successfully created." }
        else
          format.html { redirect_to survey_path(@survey), notice: "Survey was successfully created." }
        end
      else
        format.html { redirect_to new_survey_path, notice: "Failed to create survey." }
      end
    end
  end

  def show
    authorize @survey
    @question = Survey::Question.new
    if RecentSurvey.where(user: current_user, survey_surveys: @survey).exists?
      RecentSurvey.where(user: current_user, survey_surveys: @survey).first.increment!(:count)
    else
      RecentSurvey.create(user: current_user, survey_surveys: @survey, count: 1)
    end
  end

  def attempts
    authorize @survey
    @survey = Survey::Survey.find(params[:survey_id])
    attempts = Survey::Attempt.where(survey_id: params[:survey_id]).includes(:participant, :survey, :actor).order(updated_at: :desc).order(created_at: :desc).all
    @pagy, @attempts = pagy(attempts, items: 10)
    render_partial("surveys/attempt", collection: @attempts, cached: true) if stale?(@attempts)
  end

  def pin
    authorize :Survey
    @survey.update(pin: true)
    redirect_to survey_path(@survey), notice: "Survey has been pinned."
  end

  def unpin
    authorize :Survey
    @survey.update(pin: false)
    redirect_to survey_path(@survey), notice: "Survey has been unpinned."
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

    surveys = Survey::Survey.inactive.order(archived_on: :asc)
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

  def find_survey
    @survey = Survey::Survey.find(params[:survey_id])
  end

  def set_survey
    @survey = Survey::Survey.find(params[:id])
  end

  def survey_params
    params.require(:survey_survey).permit(:name, :survey_type, :description, :folder_id)
  end
end
