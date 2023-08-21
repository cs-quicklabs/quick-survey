class CreateJoinTableUserSurvey < ActiveRecord::Migration[7.0]
  def change
    create_table :recent_surveys do |t|
      t.references :user, foreign_key: true, null: false
      t.references :survey_surveys, foreign_key: true, null: false
      t.integer :count, default: 0
    end
  end
end
