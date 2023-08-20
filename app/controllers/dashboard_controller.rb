class DashboardController < ApplicationController
  def index
    authorize :dashboard
    @pinned_surveys = Survey::Survey.all.active.where(pin: true).order("created_at DESC")
  end

  def events
    authorize :dashboard, :index?

    @events = Event.includes(:eventable, :trackable, :user).order(created_at: :desc).limit(50).decorate
  end
end
