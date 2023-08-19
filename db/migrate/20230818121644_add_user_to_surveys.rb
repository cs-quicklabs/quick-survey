class AddUserToSurveys < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_surveys, :user_id, :integer, null: true
  end
end
