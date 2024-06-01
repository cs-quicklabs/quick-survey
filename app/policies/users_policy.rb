class UsersPolicy < ApplicationPolicy
  def create?
    !user.member?
  end

  def index?
    !user.member?
  end

  def deactivated?
    !user.member?
  end
end
