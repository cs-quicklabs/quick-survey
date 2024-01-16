class Survey::SurveyPolicy < Survey::BaseSurveyPolicy
  def index?
    #!user.member?
    true
  end

  def edit?
    #survey = record
    #index? and survey.active
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
    index? and !record.active
  end

  def show?
    # if !user.member?
    #   return true
    # elsif record.folder and record.active
    #   record.folder.space.users.include?(user)
    # else
    #   false
    # end
    true
  end

  def pin?
    show? and record.active? and !record.pin
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
    show? and record.active? and record.pin
  end

  def attempts?
    true
  end

  def attempt?
    #show? and record.active?
    true
  end

  def delete_attempts?
    attempt?
  end
end
