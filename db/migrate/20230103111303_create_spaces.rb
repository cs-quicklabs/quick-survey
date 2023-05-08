class CreateSpaces < ActiveRecord::Migration[7.0]
  def change
    create_table :spaces do |t|
      t.string :title
      t.references :account, foreign_key: true, null: false
      t.timestamps
    end
  end
end
