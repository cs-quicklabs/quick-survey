class UserPolicy < ApplicationPolicy
  def update?
    true
  end

  def create?
    true
  end

  def index?
    user.admin?
  end

  def show?
    true
  end

  def profile?
    true
  end
  def edit?
    user.admin?
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
end
