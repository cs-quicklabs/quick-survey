class Survey::AttemptPolicy < Survey::BaseSurveyPolicy
  def answer?
    record.actor == user
  end

  def submit?
    user.member?
  end

  def report?
    user.member?
  end

  def score?
    answer?
  end

  def check?
    answer?
  end
end
