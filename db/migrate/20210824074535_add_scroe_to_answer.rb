class AddScroeToAnswer < ActiveRecord::Migration[6.1]
  def change
    add_column :survey_answers, :score, :integer, default: 0, null: false
  end
end
