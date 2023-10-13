class SetAdminForAccount < ActiveRecord::Migration[7.1]
  def change
    Account.all.each do |account|
      if !account.owner.nil?
        Account.owner(account.id).update(role: "admin")
      end
    end
  end
end
