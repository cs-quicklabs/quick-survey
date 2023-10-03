class AddConfirmableToUser < ActiveRecord::Migration[6.1]
  def change
    change_table :users do |t|
      t.string :unconfirmed_email
    end
    ActsAsTenant.without_tenant do
      User.all.each do |user|
        user.confirmed_at = Time.now.utc
        user.save!
      end
    end
  end
end
