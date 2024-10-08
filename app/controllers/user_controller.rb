class UserController < BaseController
  before_action :set_user, only: [:update_password, :update_profile, :profile, :password]
  before_action :build_form, only: [:update_password, :password]
  respond_to :html, :json

  def update_permission
    authorize @user
    redirect_to user_index_path, notice: "User was updated successfully" if @user.update(permission)
  end

  def update_profile
    authorize @user
    respond_to do |format|
      if @user.update(user_params)
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@user, partial: "user/forms/profile", locals: { message: "User was updated successfully", user: @user }) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@user, partial: "user/forms/profile", locals: { user: @user }) }
      end
    end
  end

  def update_password
    authorize @user
    respond_to do |format|
      if @form.submit(change_password_params)
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@user, partial: "user/forms/password", locals: { message: "Password was updated successfully", user: @user }) }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@user, partial: "user/forms/password", locals: { user: @user }) }
      end
    end
  end

  def profile
    authorize @user
  end

  def password
    authorize @user
  end

  private

  def set_user
    @user ||= current_user
  end

  def permission
    params.require(:user).permit(:permission)
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email)
  end

  def change_password_params
    params.require(:user).permit(:original_password, :new_password, :new_password_confirmation)
  end

  def build_form
    @form ||= ChangePasswordForm.new(@user)
  end
end
