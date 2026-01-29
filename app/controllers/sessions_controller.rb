class SessionsController < ApplicationController
  allow_unauthenticated_access only: %i[ new create ]
  rate_limit to: 10, within: 3.minutes, only: :create, with: -> { redirect_to new_session_path, alert: "Try again later." }

  def new
    render layout: false
  end

  def create
    login = session_params[:email_address]
    password = session_params[:password]

    user = User.find_by(email_address: login) ||
          User.find_by(username: login)

    if user&.authenticate(password)
      start_new_session_for user
      redirect_to after_authentication_url
    else
      redirect_to root_path, alert: "Invalid email/username or password."
    end
  end

  def destroy
    terminate_session
    redirect_to root_path, status: :see_other
  end

  private

  def session_params
    params.permit(:email_address, :password)
  end
end
