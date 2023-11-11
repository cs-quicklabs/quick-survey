class ArchiveSurvey < Patterns::Service
  def initialize(survey)
    @survey = survey
  end

  def call
    begin
      remove_survey_from_folders
      delete_recent_surveys
      remove_from_pinned
      archive_survey
    rescue Exception => e
      return false
    end
    true
  end

  private

  def remove_survey_from_folders
    survey.update(folder_id: nil)
  end

  def delete_recent_surveys
    RecentSurvey.where(survey_surveys_id: survey.id).delete_all
  end

  def remove_from_pinned
    survey.update(pin: false)
  end

  def archive_survey
    @survey.update(active: false, archived_on: DateTime.now.utc)
  end

  attr_reader :survey
end
