class ReportsController < BaseController
  def checklist
    authorize [:survey, :report]
    @attempt = Survey::Attempt.find(params[:id])
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
    @attempt = Survey::Attempt.find(params[:id])
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

  def submit
    authorize [:survey, :report]
    @attempt = Survey::Attempt.find(params[:id])
    @attempt.update_attribute("comment", params[:comment])
    redirect_to attempts_path, notice: "Thank you for submitting your survey."
  end

  private

  def attempt_params
    params.permit(:id, :comment)
  end
end
