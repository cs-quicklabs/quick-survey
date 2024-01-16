class AttemptPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    #record.actor == user
    true
  end
end
