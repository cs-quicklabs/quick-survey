class FoldersMailer < ApplicationMailer
  def folder_email
    @actor = params[:actor]
    @user = params[:user]
    @folder = params[:folder]
    @space = params[:space]
    mail(to: @user.email, subject: "Quick Survey: New folder added into space", template_path: "mailers/folders_mailer")
  end

  def update_folder_email
    @actor = params[:actor]
    @user = params[:user]
    @folder = params[:folder]
    @space = params[:space]
    mail(to: @user.email, subject: "Quick Survey: Updated folder into space", template_path: "mailers/folders_mailer")
  end
end
