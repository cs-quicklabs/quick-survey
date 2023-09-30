class ChangeDefaultForActiveColumnInSurveys < ActiveRecord::Migration[7.0]
  def change
    change_column_default :survey_surveys, :active, from: false, to: true
  end
end
