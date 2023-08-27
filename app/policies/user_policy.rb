class UserPolicy < ApplicationPolicy
  def update_profile?
    true
  end

  def create?
    true
  end

  def index?
    true
  end

  def show?
    true
  end

  def profile?
    true
  end

  def password?
    true
  end

  def preferences?
    true
  end

  def update_password?
    true
  end

  def update_permission?
    user.admin?
  end

  def deactivated?
    user.admin?
  end

  def resend_invitation?
    user.admin?
  end
end
