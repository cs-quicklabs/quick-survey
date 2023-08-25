class QuestionsController < ApplicationController
  before_action :set_question, only: [:edit, :update, :destroy, :show]
  before_action :set_survey, only: [:create, :destroy, :update, :edit]

  def edit
  end

  def destroy
    @question.destroy
    redirect_to survey_path(@survey), alert: "Question was Deleted", status: 303
  end

  def update
    @question.update(question_params)
    redirect_to survey_path(@survey), notice: "Question was updated"
  end

  def reorder
    @question = Survey::Question.find(params[:question_id])
    @survey = Survey::Survey.find(params[:survey_id])
    @question.update(order: params[:order].to_i)

    if @question.save
      @change_order = @survey.questions.where.not(id: @question.id).order(:order)
      @change_order.size > 0 ?
        @change_order.each do |question|
        question.order < params[:order].to_i && question.order > 0 ? question.update(order: question.order - 1) :
          question.update(order: question.order + 1)
      end : nil

      partial = render_to_string(partial: "surveys/questions/question", locals: { questions: @survey.questions.order(:order), survey: @survey })
      respond_to do |format|
        format.turbo_stream do
          render turbo_stream: turbo_stream.update(:survey_questions, partial)
        end
        format.html
      end
    end
  end

  def create
    @question = Survey::Question.new(question_params)
    @question.survey = @survey
    @question.order = @survey.questions.size + 1
    @question.save

    add_options(@question, @survey)

    respond_to do |format|
      if @question.persisted?
        format.turbo_stream {
          render turbo_stream: turbo_stream.append(:questions, partial: "surveys/questions/question", locals: { questions: @survey.questions.order(:order), survey: @survey }, formats: [:turbo_stream]) +
                               turbo_stream.replace(Survey::Question.new, partial: "surveys/questions/form", locals: { survey: @survey, question: Survey::Question.new, message: "Question was added successfully." })
        }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(Survey::Question.new, partial: "surveys/questions/form", locals: { survey: @survey, question: @question }) }
      end
    end
  end

  private

  def add_options(question, survey)
    if survey.survey_type == 0 #checklist
      Survey::Option.new(text: "Yes", question: question, correct: true, weight: 1).save
      Survey::Option.new(text: "No", question: question, correct: false, weight: 0).save
    else
      Survey::Option.new(text: "Score", question: question, correct: true, weight: 10).save
    end
  end

  def set_question
    @question = Survey::Question.find(params[:id])
  end

  def set_survey
    @survey = Survey::Survey.find(params[:survey_id])
  end

  def question_params
    params.require(:survey_question).permit(:text, :description, :survey_id)
  end
end
