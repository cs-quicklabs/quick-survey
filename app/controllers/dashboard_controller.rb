class DashboardController < ApplicationController
  def index
    authorize :dashboard
    @pinned_surveys = Survey::Survey.all.active.where(pin: true).order("created_at DESC")
  end

  def attempts
    authorize :dashboard, :index?
    @attempts = Survey::Attempt.all.includes(:participant, :survey, :actor).where(actor_id: current_user.id).order("created_at DESC")
  end
end
