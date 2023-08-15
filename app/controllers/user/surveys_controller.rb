class User::SurveysController < User::BaseController
  def index
    authorize @user, :index?
    attempts = Survey::Attempt.includes(:survey).where(actor: @user).order(created_at: :desc)
    @pagy, @attempts = pagy_nil_safe(params, attempts, items: LIMIT)
    render_partial("user/surveys/survey", collection: @attempts) if stale?(@attempts)
  end
end
