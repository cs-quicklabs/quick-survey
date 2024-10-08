class UsersController < BaseController
  before_action :set_user, only: %i[update destroy deactivate_user activate_user edit show resend_invitation]

  def index
    authorize :users
    @title = "Users"

    users = User.all.active.order(:first_name).order(created_at: :desc)
    @pagy, @users = pagy_nil_safe(params, users, items: LIMIT)
    render_partial("users/user", collection: @users, cached: true) if stale?(@users)
  end

  def edit
    authorize @user
  end

  def show
    authorize @user
  end

  def update
    authorize @user
    respond_to do |format|
      if @user.update(user_params)
        format.turbo_stream { redirect_to users_path, status: 303, notice: "User has been updated successfully." }
      else
        format.turbo_stream do
          render turbo_stream: turbo_stream.replace(@user, partial: "user/forms/profile", locals: { user: @user })
        end
      end
    end
  end

  def destroy
    authorize @user
    if DestroyUser.call(@user).result
      redirect_to deactivated_users_path, notice: "User has been deleted successfully."
    end
  end

  def deactivate_user
    authorize @user, :update?
    if DeactivateUser.call(@user).result
      redirect_to deactivated_users_path, notice: "User has been deactivated."
    end
  end

  def activate_user
    authorize @user, :update?

    @user.update(active: true, deactivated_on: nil)
    redirect_to users_path, notice: "User has been activated."
  end

  def deactivated
    authorize :users

    users = User.all.inactive.order(deactivated_on: :desc)
    @pagy, @users = pagy_nil_safe(params, users, items: LIMIT)
    render_partial("users/deactivated_user", collection: @users, cached: true) if stale?(@users)
  end

  def resend_invitation
    authorize @user
    @user.invite! do |user|
      user.skip_invitation = true
    end

    UsersMailer.with(user: @user, token: @user.raw_invitation_token).invitation_email.deliver_later
    redirect_to users_path, notice: "Invitation has been resent successfully."
  end

  private

  def set_user
    @user ||= User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :phone, :role)
  end
end
