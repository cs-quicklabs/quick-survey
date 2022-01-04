class AddDetailsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :permission, :integer, null: true, default: ""
  end
end
