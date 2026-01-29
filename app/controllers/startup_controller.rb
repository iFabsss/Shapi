class StartupController < ApplicationController
  allow_unauthenticated_access
  def index
    render layout: false
  end
end
