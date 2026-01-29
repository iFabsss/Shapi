Rails.application.routes.draw do
  resource :session
  resources :passwords, param: :token
  resources :users, only: [ :new, :create, :show, :update ]
  get "/orders", to: "home#orders"
  resources :orders, only: [ :index, :show, :create, :update, :destroy ] do
    collection do
      get :cart
    end
  end

  root "startup#index"

  get "users/new"
  get "users/create"
  get "users/update"

  get "/home", to: "home#index"
  get "/cart", to: "home#cart"
end
