class AddColumnsToSpace < ActiveRecord::Migration[7.0]
  def change
    add_column :spaces, :archive, :boolean, default: false
    add_column :spaces, :archive_at, :datetime
  end
end
