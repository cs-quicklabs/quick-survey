class AddColumnFolderIdToSurveys < ActiveRecord::Migration[7.0]
  def change
    add_reference :survey_surveys, :folder, foreign_key: true
  end
end
