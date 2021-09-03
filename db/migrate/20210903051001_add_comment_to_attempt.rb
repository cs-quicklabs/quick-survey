class AddCommentToAttempt < ActiveRecord::Migration[6.1]
  def change
    add_column :survey_attempts, :comment, :string
  end
end
