class UsersController < ApplicationController
  before_action :set_user, only: [:update, :destroy, :deactivate_user, :activate_user, :edit]

  def index
    authorize :User
    @title = "Users"
    @resource_name = :invitation_user
    @users = User.all.active.order(:first_name).order(created_at: :desc)
  end

  def edit
    authorize @user
  end

  def update
    authorize @user
    respond_to do |format|
      if @user.update(user_params)
        format.turbo_stream { redirect_to users_path, status: 303, notice: "User has been updated." }
      else
        format.turbo_stream { render turbo_stream: turbo_stream.replace(@user, partial: "user/forms/profile", locals: { user: @user }) }
      end
    end
  end

  def destroy
    @user.destroy
    redirect_to user_index_path, status: 303, notice: "User has been deleted."
  end

  def deactivate_user
    @user.active = false
    @user.deactivated_on = DateTime.now.utc
    @user.save!

    redirect_to deactivated_users_path, notice: "User has been deactivated."
  end

  def activate_user
    authorize @user, :update?

    @user.update(active: true, deactivated_on: nil)
    redirect_to users_path, notice: "User has been activated."
  end

  def deactivated
    authorize :User

    users = User.all.inactive.order(deactivated_on: :desc)
    @pagy, @users = pagy_nil_safe(params, users, items: LIMIT)
    render_partial("users/deactivated_user", collection: @users, cached: true) if stale?(@users)
  end

  private

  def set_user
    @user ||= User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :phone, :role)
  end
end