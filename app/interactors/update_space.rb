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
  end

  attr_reader :space, :actor, :users, :params
end
