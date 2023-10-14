class QuestionPolicy < ApplicationPolicy
  def create?
    !user.member?
  end

  def reorder?
    !user.member?
  end
end
