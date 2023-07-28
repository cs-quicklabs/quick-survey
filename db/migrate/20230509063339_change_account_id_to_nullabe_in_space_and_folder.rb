class ChangeAccountIdToNullabeInSpaceAndFolder < ActiveRecord::Migration[7.0]
  def change
    change_column_null :spaces, :account_id, true
    change_column_null :folders, :account_id, true
  end
end
