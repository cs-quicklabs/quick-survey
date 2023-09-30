class AddPinColumnToSurveys < ActiveRecord::Migration[7.0]
  def change
    add_column :survey_surveys, :pin, :boolean, default: false
  end
end
