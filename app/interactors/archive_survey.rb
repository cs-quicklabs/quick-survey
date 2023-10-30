class ArchiveSurvey < Patterns::Service
  def initialize(survey)
    @survey = survey
  end

  def call
    begin
      remove_survey_from_folders
      delete_attempts
      delete_recent_surveys
      survey.destroy
    rescue Exception => e
      return false
    end
    true
  end

  private

  def remove_survey_from_folders
    survey.update(folder_id: nil)
  end

  def delete_attempts
    Survey::Attempt.where(survey_id: survey.id).delete_all
  end

  def delete_recent_surveys
    RecentSurvey.where(survey_surveys_id: survey.id).delete_all
  end

  attr_reader :survey
end
