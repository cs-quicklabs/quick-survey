class QuestionPolicy < ApplicationPolicy
  def index?
    true
  end

  def edit?
    index?
  end

  def new?
    index?
  end

  def create?
    index?
  end

  def update?
    index?
  end

  def destroy?
    true
  end
end
