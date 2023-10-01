class Survey::SurveyPolicy < ApplicationPolicy
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

  def clone?
    index?
  end

  def destroy?
    index?
  end

  def show?
    index?
  end

  def pin?
    index?
  end

  def unpin?
    index?
  end

  def attempts?
    index?
  end

  def attempt?
    show? and record.active
  end
end
