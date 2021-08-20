class SearchController < ApplicationController
  def surveys
    like_keyword = "%#{params[:q]}%"
    @surveys = Survey::Survey.where("name ILIKE ?", like_keyword)
      .limit(10).order(:name)

    render layout: false
  end
end
