class AddActorToSurveyAttempts < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_attempts, :actor_id, :integer, null: true, default: ""
  end
end
