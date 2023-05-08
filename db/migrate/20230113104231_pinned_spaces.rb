class PinnedSpaces < ActiveRecord::Migration[7.0]
  def change
    create_table :pinned_spaces do |t|
      t.references :user, null: false, foreign_key: true
      t.references :space, null: false, foreign_key: true
    end
  end
end
