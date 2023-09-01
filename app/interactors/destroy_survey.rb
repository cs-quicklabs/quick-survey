class DestroySurvey < Patterns::Service
  def initialize(survey)
    @survey = survey
  end

  def call
    begin
      delete_attempts
      survey.destroy
    rescue Exception => e
      return false
    end
    true
  end

  private

  def delete_attempts
    Survey::Attempt.where(survey_id: survey.id).delete_all
  end

  attr_reader :survey
end
