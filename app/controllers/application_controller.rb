class ApplicationController < ActionController::Base
  include Pundit
  
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::NotDefinedError, with: :record_not_found
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::InvalidForeignKey, with: :show_referenced_alert
  rescue_from ActionController::InvalidAuthenticityToken, with: :invalid_token

  before_action :set_redirect_path, unless: :user_signed_in?
  before_action :set_current_account

  def set_current_account
    Current.account = current_user.account if current_user
  end

  etag do
    if Rails.env == "production" or Rails.env == "staging"
      heroku_version
    else
      "screener"
    end
  end

  fragment_cache_key do
    "screener"
  end

  def heroku_version
    ENV["HEROKU_RELEASE_VERSION"] if Rails.env == "production" or Rails.env == "staging"
  end

  def render_partial(partial, collection:, cached: true)
    respond_to do |format|
      format.html
      format.json do
        render json: { entries: render_to_string(partial:, formats: [:html], collection:, cached:),
                      pagination: render_to_string(partial: "shared/paginator", formats: [:html],
                                                   locals: { pagy: @pagy }) }
      end
    end
  end

  def after_invite_path_for(_resource)
    users_path
  end

  def render_partial_as(partial, collection:, as:, cached: true)
    respond_to do |format|
      format.html
      format.json do
        render json: { entries: render_to_string(partial:, formats: [:html], collection:, as:, cached:),
                      pagination: render_to_string(partial: "shared/paginator", formats: [:html],
                                                   locals: { pagy: @pagy }) }
      end
    end
  end

  def set_redirect_path
    @redirect_path = request.path
  end

  def show_referenced_alert(_exception)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("modal", partial: "shared/modal",
                                                           locals: { title: "Unable to Delete Record", message: "This record has been associated with other records in system therefore deleting this might result in unexpected behavior. If you want to delete this please make sure all assosications have been removed first.", main_button_visible: false })
      end
    end
  end

  def show_delete_confirmation_alert
    show_confirmation_alert("Delete Record", "Are you sure you want to delete this record?")
  end

  def show_confirmation_alert(title, message)
    respond_to do |format|
      format.turbo_stream do
        render turbo_stream: turbo_stream.replace("modal", partial: "shared/modal",
                                                           locals: { title:, message:, main_button_visible: true })
      end
    end
  end

  def after_sign_in_path_for(resource)
    if params[:redirect_to].present?
      store_location_for(resource, params[:redirect_to])
    elsif request.referer == new_user_session_url
      super
    else
      landing_path
    end
  end

  def after_sign_out_path_for(_resource)
    root_path
  end

  def user_not_authorized
    redirect_to(root_path)
  end

  def signed_in_root_path(_resource)
    root_path
  end

  def record_not_found
    user_not_authorized
  end

  def landing_path
    root_path
  end

  def invalid_token
    sign_out(current_user) if current_user
    redirect_to new_user_session_path, alert: "Your session has expired. Please login again."
  end

  def render_timeline(partial, collection:, cached: true)
    respond_to do |format|
      format.html
      format.json do
        render json: { entries: render_to_string(partial:, formats: [:html], collection:, as: :event, cached:),
                      pagination: render_to_string(partial: "shared/paginator", formats: [:html],
                                                   locals: { pagy: @pagy }) }
      end
    end
  end

  def pagy_nil_safe(params, collection, vars = {})
    pagy = Pagy.new(count: collection.count(:all), page: params[:page], **vars)
    return pagy, collection.offset(pagy.offset).limit(pagy.items) if collection.respond_to?(:offset)

    [pagy, collection]
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:accept_invitation, keys: %i[first_name last_name])
  end
end
