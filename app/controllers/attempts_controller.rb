class AttemptsController < BaseController
  before_action :set_survey, only: [:new, :create]
  before_action :set_attempt, only: [:show, :submit, :answer]

  def index
    authorize :Attempt
    @attempts = Survey::Attempt.includes(:participant, :survey, :actor).order(updated_at: :desc).order(created_at: :desc)
    @pagy, @attempts = pagy_nil_safe(params, @attempts, items: LIMIT)
    render_partial("attempts/attempt", collection: @attempts, cached: true) if stale?(@attempts)
  end

  def new
    authorize :Attempt
    @attempt = Survey::Attempt.new
  end

  def create
    authorize :Attempt
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
    if @attempt.survey.survey_type == 0
      redirect_to survey_checklist_submit_path(@attempt)
    else
      redirect_to survey_score_submit_path(@attempt)
    end
  end

  def answer
    authorize @attempt
    question = Survey::Question.find(params[:question_id])
    option = Survey::Option.find(params[:option_id])
    answer = Survey::Answer.find_by(attempt: @attempt, question: question)
    if answer
      answer.update_attribute(:option_id, option.id)
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
    attempt = Survey::Attempt.find(element.dataset[:attempt_id])
    question = Survey::Question.find(element.dataset[:question_id])
    option = Survey::Option.find(element.dataset[:option_id])

    answer = Survey::Answer.find_by(attempt: attempt, question: question, option: option)
    if answer
      answer.update(score: element.dataset[:score].to_i)
    else
      Survey::Answer.create(attempt: attempt, question: question, option: option, correct: true, score: element.dataset[:score].to_i)
    end
    partial = render_to_string(partial: "attempts/options", locals: { question: question, attempt: attempt, survey: attempt.survey })
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.update("survey_question_#{question.id}", partial) }
    end
  end

  private

  def set_attempt
    @attempt ||= Survey::Attempt.find(params[:id])
  end

  def set_survey
    @survey = Survey::Survey.find(params[:survey_id] || params[:id])
  end
end
