class AddFolderToSpace < Patterns::Service
  def initialize(space, params, send_email)
    @space = space
    @folder = space.folders.new(params)
    @actor = params[:user_id]
    @send_email = send_email
  end

  def call
    begin
      add_folder
      email
    rescue
      folder
    end
    folder
  end

  def add_folder
    folder.save!
  end

  def email
    return unless !send_email.nil? && draft.nil?
    (space.users - [actor]).each do |user|
      if deliver_email?(user)
        MessagesMailer.with(actor: actor, employee: user, folder: folder, space: space).message_email.deliver_later
      end
    end
  end

  def deliver_email?(employee)
    (actor != employee) and employee.email_enabled and employee.account.email_enabled
  end

  attr_reader :space, :folder, :actor, :send_email
end
