class SurveyPolicy < ApplicationPolicy
  def index?
    #!user.member?
    true
  end

  def edit?
    #index? and record.active
    true
  end

  def new?
    #!user.member?
    true
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
    # if !user.member?
    #   return true
    # elsif record.folder
    #   record.folder.space.users.include?(user)
    # else
    #   false
    # end
    true
  end

  def pin?
    survey = record
    users = survey.folder.space.users
    if users.include?(user) and !survey.active?
      return true
    else
      return false
    end
  end

  def archived?
    index?
  end

  def archive_survey?
    index? and record.active
  end

  def unarchive_survey?
    index? and !record.active
  end

  def unpin?
    pin? and user.pinned_spaces.include?(record) and !record.active?
  end

  def attempts?
    index?
  end
end
