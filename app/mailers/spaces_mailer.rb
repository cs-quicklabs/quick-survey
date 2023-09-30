class SpacesMailer < ApplicationMailer
  def space_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "A space has been created", template_path: "mailers/spaces_mailer")
  end

  def archived_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "Space Archived", template_path: "mailers/spaces_mailer")
  end

  def unarchived_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "Space Unarchived", template_path: "mailers/spaces_mailer")
  end
end
