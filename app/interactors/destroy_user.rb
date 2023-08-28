class DestroyUser < Patterns::Service
  def initialize(user)
    @user = user
  end

  def call
    begin
      delete_folders
      delete_spaces
      delete_surveys
      delete_attempts
      user.destroy
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

  def delete_surveys
    Survey::Survey.where(user_id: @user.id).delete_all
  end

  def delete_attempts
    Survey::Attempt.where(actor_id: @user.id).delete_all
  end

  attr_reader :user
end
