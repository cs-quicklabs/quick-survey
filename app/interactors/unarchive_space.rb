class UnarchiveSpace < Patterns::Service
  def initialize(space, actor)
    @space = space
    @actor = actor
  end

  def call
    begin
      unarchive_space
      send_email
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
    (space.users - [actor]).each do |user|
      SpacesMailer.with(space: space, employee: user, actor: actor).unarchived_email.deliver_later if deliver_email?(user)
    end
  end

  def deliver_email?(employee)
    employee.email_enabled and employee.account.email_enabled and employee.sign_in_count > 0
  end

  attr_reader :space, :actor
end
