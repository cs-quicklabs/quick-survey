class AddDetailsToSpaces < ActiveRecord::Migration[7.0]
  def change
    add_reference :spaces, :user, foreign_key: true
    add_column :spaces, :description, :string
  end
end
