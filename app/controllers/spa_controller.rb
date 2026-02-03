class SpaController < ApplicationController
  layout false
  before_action :authenticate_user_for_staff!

  def index
    render :index
  end

  private

  def authenticate_user_for_staff!
    # Check if the request path starts with /staff
    if request.path.start_with?("/staff")
      # Redirect to login if user is not authenticated
      unless user_signed_in?
        redirect_to new_user_session_path
      end
    end
  end
end
