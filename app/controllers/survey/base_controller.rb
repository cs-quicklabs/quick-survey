class Survey::BaseController < BaseController
  include Pagy::Backend

  before_action :set_survey, only: [:create, :destroy, :update, :edit, :new]

  def set_survey
    @survey = Survey::Survey.find(params[:survey_id])
  end
end
