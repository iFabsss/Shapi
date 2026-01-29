class AddImageSourceToOrders < ActiveRecord::Migration[8.1]
  def change
    add_column :orders, :img_src, :string
  end
end
