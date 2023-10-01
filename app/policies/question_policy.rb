class QuestionPolicy < ApplicationPolicy
  def create?
    !user.member?
  end
end
