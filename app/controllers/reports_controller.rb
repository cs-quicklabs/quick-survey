class ReportsController < ApplicationController
  def checklist
    @attempt = Survey::Attempt.find(params[:id])
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "#{@attempt.survey.name}",
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
        render pdf: "#{@attempt.survey.name}",
               page_size: "A4",
               template: "pdf/score.html.erb",
               layout: "pdf.html",
               lowquality: true,
               zoom: 1,
               dpi: 75
      end
    end
  end
end
