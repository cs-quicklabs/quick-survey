class AddTimestampsToAttempts < ActiveRecord::Migration[7.0]
  def change
    add_timestamps :survey_attempts, null: false, default: DateTime.now
  end
end
