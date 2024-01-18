class QuestionPolicy < ApplicationPolicy
  def create?
    true
  end

  def reorder?
    true
  end
end
