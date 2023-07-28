class DestroyAllSurveysAndAttemptsWithEmptySurveyDescription < ActiveRecord::Migration[7.0]
  def change
    Survey::Survey.where(description: nil).or(Survey::Survey.where(description: "N/A")).destroy_all
    (Survey::Attempt.pluck(:survey_id) - Survey::Survey.pluck(:id)).each do |survey_id|
      Survey::Attempt.where(survey_id: survey_id).destroy_all
    end
  end
end
