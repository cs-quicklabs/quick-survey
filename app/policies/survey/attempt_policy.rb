class Survey::AttemptPolicy < Survey::BaseSurveyPolicy
  def index?
    true
  end

  def new?
    true
  end

  def create?
    true
  end

  def edit?
    true
  end

  def show?
    true
  end

  def update?
    edit?
  end

  def preview?
    show?
  end

  def destroy?
    edit?
  end

  def submit?
    index?
  end

  def checklist?
    true
  end

  def score?
    true
  end

  def answer?
    index?
  end

  private

  def show_project_survey_attempt?
    attempt = record.first
    project = attempt.participant
    user.admin? or user.is_manager?(project) or user.is_observer?(project)
  end

  def show_employee_survey_attempt?
    attempt = record.first
    employee = attempt.participant
    user.admin? or user.subordinate?(employee) or user.project_participant?(employee) or user.observed_project_participant?(employee) or attempt.actor == user
  end
end
