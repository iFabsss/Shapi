Rails.application.routes.draw do
  get "users/new"
  get "users/create"
  get "users/update"
  resource :session
  resources :passwords, param: :token
  resources :users, only: [ :new, :create, :show, :update ]
  root "startup#index"
  get "/home", to: "home#index"
  get "/cart", to: "home#cart"
  get "/orders", to: "home#orders"
end
