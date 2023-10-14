class AttemptPolicy < ApplicationPolicy
  def index?
    !user.member?
  end

  def show?
    record.actor == user
  end
end
