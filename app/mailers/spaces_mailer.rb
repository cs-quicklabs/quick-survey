class SpacesMailer < ApplicationMailer
  def space_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "Quick Survey: A space has been created", template_path: "mailers/spaces_mailer")
  end

  def update_space_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "Quick Survey: A space has been updated", template_path: "mailers/spaces_mailer")
  end

  def archived_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "Quick Survey: Space Archived", template_path: "mailers/spaces_mailer")
  end

  def unarchived_email
    @actor = params[:actor]
    @user = params[:user]
    @space = params[:space]
    mail(to: @user.email, subject: "Quick Survey: Space Unarchived", template_path: "mailers/spaces_mailer")
  end
end
