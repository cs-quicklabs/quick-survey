class SurveyPolicy < ApplicationPolicy
  def index?
    !user.member?
  end

  def edit?
    index? and survey.active
  end

  def new?
    !user.member?
  end

  def create?
    index?
  end

  def update?
    edit?
  end

  def clone?
    edit?
  end

  def destroy?
    index? and !survey.active
  end

  def show?
    if record.space
      record.space.users.include?(user)
    else
      !user.member?
    end
  end

  def pin?
    survey = record
    users = survey.space.users
    if users.include?(user) and !survey.archive
      return true
    else
      return false
    end
  end

  def unpin?
    pin? and user.pinned_spaces.include?(record) and !record.archive
  end

  def attempts?
    index?
  end
end
