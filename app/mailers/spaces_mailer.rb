class SpacesMailer < ApplicationMailer
  def space_email
    @actor = params[:actor]
    @employee = params[:employee]
    @space = params[:space]
    mail(to: @employee.email, subject: "New Space Created", template_path: "mailers/spaces_mailer")
  end

  def archived_email
    @actor = params[:actor]
    @employee = params[:employee]
    @space = params[:space]
    mail(to: @employee.email, subject: "Space Archived", template_path: "mailers/spaces_mailer")
  end

  def unarchived_email
    @actor = params[:actor]
    @employee = params[:employee]
    @space = params[:space]
    mail(to: @employee.email, subject: "Space Unarchived", template_path: "mailers/spaces_mailer")
  end
end
