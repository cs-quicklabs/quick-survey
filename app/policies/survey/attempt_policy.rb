class Survey::AttemptPolicy < Survey::BaseSurveyPolicy
  def answer?
    record.actor == user
  end

  def submit?
    answer?
  end

  def report?
    !user.member?
  end
end
