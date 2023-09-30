class AddAccountToAttempts < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_attempts, :account_id, :integer
    add_column :survey_surveys, :account_id, :integer
  end
end
