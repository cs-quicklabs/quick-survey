class JoinTableSpacesUsers < ActiveRecord::Migration[7.0]
  def change
    create_join_table :users, :spaces do |t|
      t.timestamps
    end
  end
end
