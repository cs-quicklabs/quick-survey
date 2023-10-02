class User::BaseUserPolicy < ApplicationPolicy
  def index?
    true
  end
end
