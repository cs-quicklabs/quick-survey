class UnarchiveSpace < Patterns::Service
  def initialize(space, actor)
    @space = space
    @actor = actor
  end

  def call
    unarchive_space
    send_email
    begin
    rescue
      space
    end
    space
  end

  private

  def unarchive_space
    @space.update(archive: false, archive_at: nil)
  end

  def send_email
    (space.users).each do |user|
      SpacesMailer.with(space: space, user: user, actor: actor).unarchived_email.deliver_later if deliver_email?(user)
    end
  end

  def deliver_email?(user)
    (actor != user) and user.email_enabled and user.sign_in_count > 0
  end

  attr_reader :space, :actor
end
