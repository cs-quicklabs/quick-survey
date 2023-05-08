class ArchiveSpace < Patterns::Service
  def initialize(space, actor)
    @space = space
    @actor = actor
  end

  def call
    begin
      delete_drafts
      archive_space
      send_email
    rescue
      space
    end
    space
  end

  private

  def delete_drafts
    space.messages.draft.destroy_all
  end

  def archive_space
    actor.pinned.destroy @space
    @space.update(archive: true, archive_at: Time.now)
  end

  def send_email
    (space.users - [actor]).each do |user|
      SpacesMailer.with(space: space, employee: user, actor: actor).archived_email.deliver_later if deliver_email?(user)
    end
  end

  def deliver_email?(employee)
    employee.email_enabled and employee.account.email_enabled and employee.sign_in_count > 0
  end

  attr_reader :space, :actor
end
