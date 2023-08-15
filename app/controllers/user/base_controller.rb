class User::BaseController < ApplicationController
  before_action :set_user, only: %i[ index ]
  after_action :verify_authorized
  include Pagy::Backend

  def set_user
    @user = User.find(params[:user_id])
  end
end
