class User::SurveysController < User::BaseController
  def index
    authorize @user, :index?
    surveys = Survey::Survey.active.where(user_id: @user.id).order(created_at: :desc)
    @pagy, @surveys = pagy_nil_safe(params, surveys, items: LIMIT)
    render_partial("user/surveys/survey", collection: @surveys) if stale?(@surveys)
  end
end
