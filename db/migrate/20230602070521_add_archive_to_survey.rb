class AddArchiveToSurvey < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_surveys, :archived_on, :date
  end
end
