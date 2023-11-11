class DeactivateUser < Patterns::Service
  def initialize(user)
    @user = user
  end

  def call
    begin
      remove_from_spaces
      deactivate
    rescue Exception => e
      return false
    end
    true
  end

  private

  def remove_from_spaces
    user.spaces.each do |space|
      space.users.destroy user
    end
  end

  def deactivate
    @user.active = false
    @user.deactivated_on = DateTime.now.utc

    @user.save!
  end

  attr_reader :user
end
