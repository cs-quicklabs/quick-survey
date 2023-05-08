class AddFolderToSpace < Patterns::Service
  def initialize(space, message, actor, draft, send_email)
    @space = space
    @message = message
    @actor = actor
    @draft = draft
    @send_email = send_email
  end

  def call
    begin
      add_message
      email
    rescue
      message
    end
    message
  end

  def add_message
    message.space = space
    message.user = actor
    if draft.nil?
      message.published = true
    end
    message.save!
  end

  def email
    return unless !send_email.nil? && draft.nil?
    (space.users - [actor]).each do |user|
      if deliver_email?(user)
        MessagesMailer.with(actor: actor, employee: user, message: message, space: space).message_email.deliver_later
      end
    end
  end

  def deliver_email?(employee)
    (actor != employee) and employee.email_enabled and employee.account.email_enabled
  end

  attr_reader :space, :message, :actor, :draft, :send_email
end
