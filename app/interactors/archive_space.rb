class ArchiveSpace < Patterns::Service
  def initialize(space, actor)
    @space = space
    @actor = actor
  end

  def call
    archive_space
    send_email
    begin
    rescue
      space
    end
    space
  end

  private

  def archive_space
    actor.pinned.destroy @space
    @space.update(archive: true, archive_at: Time.now)
  end

  def send_email
    (space.users).each do |user|
      SpacesMailer.with(space: space, user: user, actor: actor).archived_email.deliver_later if deliver_email?(user)
    end
  end

  def deliver_email?(user)
    (actor != user) and user.email_enabled and user.sign_in_count > 0
  end

  attr_reader :space, :actor
end
