class User::AttemptPolicy < User::BaseUserPolicy
  def delete_attempts?
    #!user.member?
    true
  end
end
