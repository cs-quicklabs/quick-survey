class AddEmailEnabedToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :email_enabled, :boolean, default: true
  end
end
