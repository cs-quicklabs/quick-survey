class Survey::ReportPolicy < Survey::BaseSurveyPolicy

  # this should not be a problem as we are controlling who can see attempts in attempts policy
  # so if they can not see if they can not submit it
  def submit?
    true
  end

  def score?
    submit?
  end

  def checklist?
    submit?
  end

  def yes_no?
    submit?
  end
end
