class ApplicationController < ActionController::Base
  include Pagy::Backend

  etag {
    if Rails.env == "production" or Rails.env == "staging"
      heroku_version
    else
      "screener"
    end
  }

  fragment_cache_key do
    "screener"
  end

  def heroku_version
    ENV["HEROKU_RELEASE_VERSION"] if Rails.env == "production" or Rails.env == "staging"
  end

  def render_partial(partial, collection:, cached: true)
    respond_to do |format|
      format.html
      format.json {
        render json: { entries: render_to_string(partial: partial, formats: [:html], collection: collection, cached: cached),
                       pagination: render_to_string(partial: "shared/paginator", formats: [:html], locals: { pagy: @pagy }) }
      }
    end
  end
end
