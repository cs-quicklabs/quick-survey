class User::BaseUserPolicy < ApplicationPolicy
  def index?
    !user.member?
  end
end
