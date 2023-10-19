class SubmitController < BaseController
  before_action :set_attempt, only: [:checklist, :score, :submit]

  def checklist
    authorize @attempt, :submit?
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
    authorize @attempt, :submit?
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
    authorize @attempt, :submit?
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
    binding.irb
    authorize @attempt, :submit?
    @attempt.update_attribute("comment", params[:comment])
    binding.irb
    redirect_to attempts_path, notice: "Thank you for submitting your survey."
  end

  private

  def attempt_params
    params.permit(:id, :comment)
  end

  def set_attempt
    @attempt ||= Survey::Attempt.find(params[:id])
  end
end
