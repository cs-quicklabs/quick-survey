class RegistrationsController < Devise::RegistrationsController
  before_action :build_form

  def new
    super
  end

  def create
    resource = @form.submit(registration_params)
    if resource.nil? or !resource.persisted?
      show_errors
    else
      set_flash_message! :notice, :"signed_up_but_#{resource.inactive_message}"
      redirect_to new_user_session_path
    end
  end

  def show_errors
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.replace("sign_up_form", partial: "devise/registrations/form", locals: { resource: @form }) }
    end
  end

  private

  def registration_params
    params.require(:user).permit(:first_name, :last_name, :email, :new_password, :new_password_confirmation)
  end

  def build_form
    @form ||= SignUpForm.new
  end
end
