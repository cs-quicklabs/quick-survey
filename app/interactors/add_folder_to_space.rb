class AddFolderToSpace < Patterns::Service
  def initialize(space, params, send_email)
    @space = space
    @folder = space.folders.new(params)
    @actor = User.find(params[:user_id])
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
    return unless !send_email.nil?
    (space.users - [actor]).each do |user|
      if deliver_email?(user)
        FoldersMailer.with(actor: actor, user: user, folder: folder, space: space).folder_email.deliver_later
      end
    end
  end

  def deliver_email?(user)
    (actor != user) and user.email_enabled
  end

  attr_reader :space, :folder, :actor, :send_email
end
