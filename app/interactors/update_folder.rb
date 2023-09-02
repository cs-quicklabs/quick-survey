class UpdateFolder < Patterns::Service
  def initialize(space, folder, actor, send_email, params)
    @space = space
    @folder = folder
    @actor = actor
    @send_email = send_email
    @params = params
  end

  def call
    begin
      update_folder
    rescue
      folder
    end
    folder
  end

  def update_folder
    folder.update(params)
  end

  def email
    return unless !send_email.nil? && draft.nil?
    (space.users - [actor]).each do |user|
      if deliver_email?(user)
        MessagesMailer.with(actor: actor, employee: user, folder: folder, space: space).update_folder_email.deliver_later
      end
    end
  end

  def deliver_email?(employee)
    (actor != employee) and employee.email_enabled and employee.account.email_enabled
  end

  attr_reader :space, :folder, :actor, :send_email, :params
end
