class Survey::QuestionPolicy < Survey::BaseSurveyPolicy
  def index?
    !user.member?
  end

  def edit?
    index?
  end

  def new?
    index?
  end

  def update?
    index?
  end

  def destroy?
    true
  end
end
