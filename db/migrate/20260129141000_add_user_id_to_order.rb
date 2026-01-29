class AddUserIdToOrder < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :user_id, :string
  end
end
