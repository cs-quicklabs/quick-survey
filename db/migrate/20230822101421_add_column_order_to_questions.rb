class AddColumnOrderToQuestions < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_questions, :order, :integer, null: false, default: 0
  end
end
