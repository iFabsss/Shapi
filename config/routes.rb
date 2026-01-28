Rails.application.routes.draw do
  root "startup#index"
  get "/home", to: "home#index"
  get "/cart", to: "home#cart"
  get "/orders", to: "home#orders"


  # root = main startup page
end
