class UpdateChecklistSurveyToYesNo < ActiveRecord::Migration[7.1]
  def change
    Survey::Survey.where(survey_type: 0).update_all(survey_type: 2)
  end
end
