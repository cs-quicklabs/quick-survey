class AddDeactivateToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :active, :boolean, default: true, null: false
    add_column :users, :deactivated_on, :date
  end
end
