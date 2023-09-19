class BackfillAccounts < ActiveRecord::Migration[7.0]
  def change
    account = Account.create(name: "Crownstack")
    User.all.each do |user|
      user.update(account_id: account.id)
    end
  end
end
