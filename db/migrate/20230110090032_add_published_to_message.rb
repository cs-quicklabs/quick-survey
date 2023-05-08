class AddPublishedToMessage < ActiveRecord::Migration[7.0]
  def change
    add_column :messages, :published, :boolean, default: false
  end
end
