class User::AttemptsController < User::BaseController
  def index
    authorize [@user, :attempt]
    attempts = Survey::Attempt.includes(:participant, :survey, :actor).where(actor: @user).order(created_at: :desc)
    @pagy, @attempts = pagy_nil_safe(params, attempts, items: LIMIT)
    render_partial("user/attempts/attempt", collection: @attempts) if stale?(@attempts)
  end

  def delete_attempts
    authorize [@user, :attempt]
    Survey::Attempt.where(actor: @user).delete_all
    redirect_to user_attempts_path(@user), notice: "User attempts has been deleted successfully"
  end
end
