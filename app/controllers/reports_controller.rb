class ReportsController < ApplicationController
  def checklist
    @attempt = Survey::Attempt.find(params[:id])
    respond_to do |format|
      format.html
      format.pdf do
        render pdf: "Invoice No. #{@attempt.id}",
               page_size: "A4",
               template: "reports/checklist.html.erb",
               layout: "pdf.html",
               lowquality: true,
               zoom: 1,
               dpi: 75
      end
    end
  end
end
