class UserMailer < ActionMailer::Base
  def invitation_email(user)
    @resource = user
    mail(to: user.email, subject: "Invitation Instructions", template_path: "devise/mailer", template_name: "invitation_instructions")
  end
end

# Path: app/views/user_mailer/invitation_instructions.html.erb
# Compare this snippet from app/views/devise/mailer/invitation_instructions.html.erb:
# <p><%= link_to 'Accept invitation', accept_invitation_url(@resource, :invitation_token => @token) %></p>
