class Screening::BaseScreeningPolicy < ApplicationPolicy
  def index?
    return false if user.member?
    true
  end
end
