class AttemptsController < BaseController
  before_action :set_survey, only: [:new, :create]
  before_action :set_attempt, only: [:show, :submit, :answer, :score, :check]

  def index
    authorize :Attempt
    @attempts = Survey::Attempt.includes(:participant, :survey, :actor).order(updated_at: :desc).order(created_at: :desc)
    @pagy, @attempts = pagy_nil_safe(params, @attempts, items: LIMIT)
    render_partial("attempts/attempt", collection: @attempts, cached: true) if stale?(@attempts)
  end

  def new
    authorize @survey, :attempt?
    @attempt = Survey::Attempt.new

    if params[:email].present? and params[:name].present?
      create_survey_attempt_and_redirect
    end
  end

  def create
    authorize @survey, :attempt?
    @participant = Survey::Participant.create(name: params[:name], email: params[:email])
    @attempt = Survey::Attempt.create(survey: @survey, participant: @participant, actor: current_user, created_at: DateTime.now)
    redirect_to new_survey_attempt_path(@attempt)
  end

  def show
    authorize @attempt
    @survey = @attempt.survey
  end

  def submit
    authorize @attempt
    if params[:commit] == "Preview then Submit"
      preview_then_submit @attempt
    else params[:commit] == "Submit without Preview"
      submit_without_preview @attempt     end
  end

  def preview_then_submit(attempt)
    attempt.update_attribute("comment", params[:comment])
    if attempt.survey.survey_type == "checklist"
      redirect_to survey_checklist_submit_path(attempt.survey, attempt)
    elsif attempt.survey.survey_type == "score"
      redirect_to survey_score_submit_path(attempt.survey, attempt)
    else
      redirect_to survey_yes_no_submit_path(attempt.survey, attempt)
    end
  end

  def submit_without_preview(attempt)
    @attempt.update_attribute("comment", params[:comment])

    redirect_to "/#{current_user.account.id}/surveys/#{attempt.survey.id}/reports/#{attempt.survey.survey_type}/#{attempt.id}", notice: "Thank you for submitting your survey."
  end

  def answer
    authorize @attempt
    question = Survey::Question.find(params[:question_id])
    option = Survey::Option.find(params[:option_id])
    answer = Survey::Answer.find_by(attempt: @attempt, question: question)
    if answer
      answer.update_attribute(:option_id, option.id)
      answer.update_attribute(:correct, option.correct?)
    else
      Survey::Answer.create(attempt: @attempt, question: question, option: option)
    end
    partial = render_to_string(partial: "attempts/options", locals: { question: question, attempt: @attempt, survey: @attempt.survey })
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.update("survey_question_#{question.id}", partial) }
    end
  end

  def score
    authorize @attempt
    question = Survey::Question.find(params[:question_id])
    option = Survey::Option.find(params[:option_id])

    answer = Survey::Answer.find_by(attempt: @attempt, question: question, option: option)
    if answer
      answer.update(score: params[:score].to_i)
    else
      Survey::Answer.create(attempt: @attempt, question: question, option: option, correct: true, score: params[:score].to_i)
    end
    partial = render_to_string(partial: "attempts/score", locals: { question: question, attempt: @attempt, survey: @attempt.survey })
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.update("survey_question_#{question.id}", partial) }
    end
  end

  def check
    authorize @attempt
    question = Survey::Question.find(params[:question_id])
    option = Survey::Option.find(params[:option_id])
    answer = Survey::Answer.find_by(attempt: @attempt, question: question, option: option)
    if answer
      answer.destroy
    else
      Survey::Answer.create(attempt: @attempt, question: question, option: option)
    end

    partial = render_to_string(partial: "attempts/check", locals: { question: question, attempt: @attempt, survey: @attempt.survey })
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.update("survey_question_#{question.id}", partial) }
    end
  end

  private

  def create_survey_attempt_and_redirect
    @participant = Survey::Participant.create(name: params[:name], email: params[:email])
    @attempt = Survey::Attempt.create(survey: @survey, participant: @participant, actor: current_user, created_at: DateTime.now)
    redirect_to new_survey_attempt_path(@attempt)
  end

  def set_attempt
    @attempt ||= Survey::Attempt.find(params[:id])
  end

  def set_survey
    @survey = Survey::Survey.find(params[:survey_id] || params[:id])
  end
end
