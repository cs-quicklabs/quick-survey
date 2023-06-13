class Space::BaseController < ApplicationController
  before_action :set_space, only: %i[ index new create edit update destroy show ]
  after_action :verify_authorized
  include Pagy::Backend

  def set_space
    @space ||= Space.find(params[:space_id])
  end
end
