class ChangeUserIdInOrdersToBigIntReference < ActiveRecord::Migration[8.1]
  def change
    remove_column :orders, :user_id, :string
    add_reference :orders, :user, type: :bigint, foreign_key: true
  end
end
