class Screening::BaseScreeningPolicy < ApplicationPolicy
  def index?
    !user.member?
  end
end
