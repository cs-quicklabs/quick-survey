class Survey::ReportsController < Survey::BaseController
  before_action :set_attempt, only: [:checklist, :score, :submit, :yes_no]

  def checklist
    authorize [:survey, :report]
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@attempt.participant.name}_#{@attempt.survey.name}",
               template: "pdf/checklist",
               layout: "pdf",
               formats: [:html]
      end
    end
  end

  def score
    authorize [:survey, :report]
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@attempt.participant.name}_#{@attempt.survey.name}",
               template: "pdf/score",
               layout: "pdf",
               formats: [:html]
      end
    end
  end

  def yes_no
    authorize [:survey, :report]
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@attempt.participant.name}_#{@attempt.survey.name}",
               template: "pdf/yes_no",
               layout: "pdf",
               formats: [:html]
      end
    end
  end

  private

  def attempt_params
    params.permit(:id, :comment)
  end

  def set_attempt
    @attempt ||= Survey::Attempt.find(params[:id])
  end
end
