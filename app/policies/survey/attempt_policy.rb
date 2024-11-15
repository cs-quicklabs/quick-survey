class Survey::AttemptPolicy < Survey::BaseSurveyPolicy
  def answer?
    true
  end

  def submit?
    true
  end

  def report?
    true
  end

  def score?
    answer?
  end

  def check?
    answer?
  end
end
