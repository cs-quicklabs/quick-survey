class Survey::QuestionPolicy < Survey::BaseSurveyPolicy
  def index?
    #!user.member?
    true
  end

  def edit?
    #!user.member?
    true
  end

  def new?
    edit?
  end

  def update?
    edit?
  end

  def destroy?
    edit?
  end
end
