class Order < ApplicationRecord
  belongs_to :user

  validates_presence_of :quantity, :status, :user_id, :product_name, :price, :img_src
  validates :quantity, numericality: { only_integer: true, greater_than: 0 }
  validates :status, presence: true, inclusion: { in: %w[cart pending completed cancelled] }
end
