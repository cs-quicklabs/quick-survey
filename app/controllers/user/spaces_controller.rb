class User::SpacesController < User::BaseController
  def index
    authorize @user, :index?
    spaces = @user.spaces.order(created_at: :desc)
    @pagy, @spaces = pagy_nil_safe(params, spaces, items: LIMIT)
    render_partial("user/spaces/space", collection: @spaces) if stale?(@spaces)
  end
end
