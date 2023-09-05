class UserInviteJob
  include Sidekiq::Worker

  def perform(user)
    user.send_invitation_email # You might have a custom method for sending the invitation email
  end
end
