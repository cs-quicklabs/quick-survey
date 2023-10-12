class AddUserToAccount < ActiveRecord::Migration[7.0]
  def change
    add_column :accounts, :owner_id, :integer, foreign_key: { to_table: :users }
  end
end
