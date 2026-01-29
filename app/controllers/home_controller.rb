class HomeController < ApplicationController
  def index
  end

  def cart
  end

  def orders
    @orders = Current.session.user.orders.where(status: [ "pending", "completed", "cancelled" ]).order(created_at: :desc)

    respond_to do |format|
      format.html
      format.json do
        if @orders.any?
          render json: { success: true, orders: @orders.as_json(only: [ :id, :product_name, :price, :quantity, :status, :img_src, :created_at ]) }
        else
          render json: { success: false, message: "No orders found" }, status: :not_found
        end
      end
    end
  end
end
