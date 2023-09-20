class BackfillAccounts < ActiveRecord::Migration[7.0]
  def change
    account = Account.create(name: "Crownstack")
    Account.reset_column_information  # Ensure that the Account model is aware of the current schema

    default_account_id = account.id
    ActsAsTenant.without_tenant do
      # Update the account_id where it is null
      User.where(account_id: nil).update_all(account_id: default_account_id)
      Space.where(account_id: nil).update_all(account_id: default_account_id)
      Survey::Survey.where(account_id: nil).update_all(account_id: default_account_id)
      Survey::Attempt.where(account_id: nil).update_all(account_id: default_account_id)
    end
  end
end
