class AddAccountsToSpaces < ActiveRecord::Migration[7.0]
  def change
    add_reference :spaces, :account, null: true, foreign_key: true
  end
end
