class CreateOrders < ActiveRecord::Migration[8.1]
  def change
    create_table :orders, id: :uuid do |t|
      t.string :product_name
      t.decimal :price
      t.integer :quantity
      t.string :status

      t.timestamps
    end
  end
end
