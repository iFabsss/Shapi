class UsersController < ApplicationController
  allow_unauthenticated_access only: %i[new create]
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save
      start_new_session_for @user
      redirect_to home_path,
                  notice: "Account created successfully!"
    else
      # Show errors inside modal
      flash[:signup_errors] = @user.errors.full_messages
      redirect_to root_path
    end
  end

  def user_params
    params.require(:user).permit(
      :username,
      :email_address,
      :password,
      :password_confirmation
    )
  end
end
