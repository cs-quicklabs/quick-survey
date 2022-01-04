class Screening::BaseScreeningPolicy < ApplicationPolicy
  def index?
    user.admin?
  end

end
