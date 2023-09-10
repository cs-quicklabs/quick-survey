class RootController < BaseController
  def index
    redirect_to dashboard_path
  end
end
