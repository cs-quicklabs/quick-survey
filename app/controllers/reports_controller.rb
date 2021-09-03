class ReportsController < ApplicationController
  def checklist
    @attempt = Survey::Attempt.find(params[:id])
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@attempt.participant.name}_#{@attempt.survey.name}",
               page_size: "A4",
               template: "pdf/checklist.html.erb",
               layout: "pdf.html",
               lowquality: true,
               zoom: 1,
               dpi: 75
      end
    end
  end

  def score
    @attempt = Survey::Attempt.find(params[:id])
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@attempt.participant.name}_#{@attempt.survey.name}",
               page_size: "A4",
               template: "pdf/score.html.erb",
               layout: "pdf.html",
               lowquality: true,
               zoom: 1,
               dpi: 75
      end
    end
  end

  def submit
    @attempt = Survey::Attempt.find(params[:id])
    @attempt.update_attribute("comment", params[:comment])
    if @attempt.survey.survey_type == 0
      redirect_to checklist_pdf_path(@attempt, format: :pdf)
    else
      redirect_to score_pdf_path(@attempt, format: :pdf)
    end
  end

  private

  def attempt_params
    params.permit(:id, :comment)
  end
end
