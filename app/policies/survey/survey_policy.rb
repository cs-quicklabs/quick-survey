class Survey::SurveyPolicy < Survey::BaseSurveyPolicy
  def index?
    !user.member?
  end

  def edit?
    survey = record
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
    index? and !record.active
  end

  def show?
    if !user.member?
      return true
    elsif record.folder and record.active
      record.folder.space.users.include?(user)
    else
      false
    end
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
    index?
  end

  def attempt?
    show? and record.active?
  end
end
