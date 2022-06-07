class SurveyPolicy < ApplicationPolicy
  def index?
    user.admin?
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

  def clone?
    index?
  end

  def destroy?
    index?
  end

  def show?
    index?
  end
end
