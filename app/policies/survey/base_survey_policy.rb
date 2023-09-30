class Survey::BaseSurveyPolicy < ApplicationPolicy
  def index?
    true
  end

  def update?
    true
  end

  def create?
    true
  end

  def destroy?
    true
  end

  def edit?
    true
  end

  def show?
    true
  end
end
