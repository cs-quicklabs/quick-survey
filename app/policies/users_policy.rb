class UsersPolicy < ApplicationPolicy
  def create?
    #!user.member?
    true
  end

  def index?
    #!user.member?
    true
  end

  def deactivated?
    #!user.member?
    true
  end
end
