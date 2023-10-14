class User::AttemptsController < User::BaseController
  def index
    authorize @user, :index?
    attempts = Survey::Attempt.includes(:participant, :survey, :actor).where(actor: @user).order(created_at: :desc)
    @pagy, @attempts = pagy_nil_safe(params, attempts, items: LIMIT)
    render_partial("user/attempts/attempt", collection: @attempts) if stale?(@attempts)
  end
end
