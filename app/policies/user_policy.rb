class UserPolicy < ApplicationPolicy
  def update_profile?
    true
  end

  def update_password?
    true
  end

  def update_permission?
    true
  end

  def profile?
    true
  end

  def password?
    true
  end

  def update?
    !user.member?
  end

  def edit?
    !user.member?
  end

  def show?
    !user.member?
  end

  def destroy?
    !user.member?
  end

  def deactivate_user?
    !user.member?
  end

  def activate_user?
    !user.member?
  end

  def resend_invitation?
    !user.member?
  end
end
