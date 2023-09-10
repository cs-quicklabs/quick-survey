class AttemptsController < BaseController
  before_action :set_survey, only: [:new, :create]

  def index
    @attempts = Survey::Attempt.includes(:participant, :survey, :actor).order(updated_at: :desc).order(created_at: :desc).all
    @pagy, @attempts = pagy(@attempts, items: 10)
    render_partial("attempts/attempt", collection: @attempts, cached: true) if stale?(@attempts)
  end

  def new
    @attempt = Survey::Attempt.new
  end

  def create
    @participant = Survey::Participant.create(name: params[:name], email: params[:email])
    @attempt = Survey::Attempt.create(survey: @survey, participant: @participant, actor: current_user, created_at: DateTime.now)
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

  def answer
    attempt = Survey::Attempt.find(params[:attempt_id])
    question = Survey::Question.find(params[:question_id])
    option = Survey::Option.find(params[:option_id])
    answer = Survey::Answer.find_by(attempt: attempt, question: question)
    if answer
      answer.update_attribute(:option_id, option.id)
    else
      Survey::Answer.create(attempt: attempt, question: question, option: option)
    end
    partial = render_to_string(partial: "attempts/options", locals: { question: question, attempt: attempt })
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.update("survey_question_#{question.id}", partial) }
    end
  end

  private

  def set_survey
    @survey ||= Survey::Survey.find(params[:id])
  end
end
