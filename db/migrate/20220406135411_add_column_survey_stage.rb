class AddColumnSurveyStage < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_surveys, :survey_stage, :integer, null: true
  end
end
