class OrdersController < ApplicationController
  before_action :ensure_logged_in


  def index
    @orders = Current.session.user.orders.order(created_at: :desc, status: "cart")
  end

  def show
    @order = Current.session.user.orders.find(params[:id])
  end

  def create
    order = current_user.orders.build(order_params)
    order.status = "cart"

    if order.save
      render json: { success: true, order_id: order.id }
    else
      render json: { success: false, errors: order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def cart
    cart_orders = Current.session.user.orders.where(status: "cart").order(created_at: :desc)
    if cart_orders.any?
      render json: { success: true, orders: cart_orders.as_json(only: [ :id, :product_name, :price, :quantity, :img_src ]) }
    else
      render json: { success: false, message: "No cart found" }, status: :not_found
    end
  end

  def destroy
    order = Current.session.user.orders.find(params[:id])
    if order.destroy
      render json: { success: true }
    else
      render json: { success: false, errors: order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    order = Current.session.user.orders.find(params[:id])
    if order.update(order_params)
      render json: { success: true }
    else
      render json: { success: false, errors: order.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def order_params
    params.require(:order).permit(:product_name, :price, :quantity, :status, :img_src)
  end

  def ensure_logged_in
    redirect_to startup_path, alert: "Please log in first." unless Current.session&.user
  end
end
