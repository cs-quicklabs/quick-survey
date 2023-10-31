class UpdateSpace < Patterns::Service
  def initialize(space, actor, users, params)
    @space = space
    @actor = actor
    @users = users.reject(&:blank?).map(&:to_i)
    @params = params
  end

  def call
    begin
      update_space
      update_space_users
      send_email
    rescue
      space
    end
    space
  end

  def update_space
    @space.update(params)
  end

  def update_space_users
    space.users.clear
    space.users << User.where("id IN (?)", users)
    space.users << space.user unless space.users.include?(space.user)
    space.touch
  end

  def send_email
    if space.users.size > 0
      @space_users = User.where("id IN (?)", users)
      @space_users.each do |user|
        if deliver_email?(user)
          SpacesMailer.with(actor: actor, user: user, space: space).space_email.deliver_later
        end
      end
    end
  end

  def deliver_email?(user)
    (actor != user) and user.email_enabled and user.sign_in_count > 0
  end

  attr_reader :space, :actor, :users, :params
end
