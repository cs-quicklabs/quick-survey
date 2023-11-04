class DeactivateUser < Patterns::Service
  def initialize(user)
    @user = user
  end

  def call
    begin
      delete_folders
      delete_spaces
      delete_surveys
      remove_from_spaces
      delete_attempts
      deactivate
    rescue Exception => e
      return false
    end
    true
  end

  private

  def delete_folders
    Folder.where(user_id: @user.id).destroy_all
  end

  def delete_spaces
    Space.where(user_id: @user.id).destroy_all
  end

  def remove_from_spaces
    user.spaces.each do |space|
      space.users.destroy user
    end
  end

  def delete_surveys
    Survey::Survey.where(user_id: @user.id).delete_all
  end

  def delete_attempts
    Survey::Attempt.where(actor_id: @user.id).delete_all
  end

  def deactivate
    @user.active = false
    @user.deactivated_on = DateTime.now.utc

    @user.save!
  end

  attr_reader :user
end
