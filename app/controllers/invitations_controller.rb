class InvitationsController < Devise::InvitationsController
  def create
    exisiting_user = User.find_by_email(params[:user][:email])
    respond_to do |format|
      if exisiting_user.present?
        format.turbo_stream { render turbo_stream: turbo_stream.replace("new_user", partial: "devise/invitations/form", locals: { resource: exisiting_user, message: "User already exists" }) }
      else
        @user = User.invite!(invitation_params, current_user)
        format.html { redirect_to users_path, notice: "User has been invited." }
      end
    end
  end

  def invitation_params
    params.require(:user).permit(:email, :account_id)
  end
end
