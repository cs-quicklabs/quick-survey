class DashboardController < BaseController
  def index
    authorize :dashboard
    @pinned_surveys = Survey::Survey.all.active.where(pin: true).order("created_at DESC")
    @recent_surveys = current_user.recent.active.order("created_at DESC").limit(5)
  end

  def activities
    authorize :dashboard, :index?
    @attempts = Survey::Attempt.all.includes(:participant, :survey, :actor).order("created_at DESC").limit(50)
  end
end
