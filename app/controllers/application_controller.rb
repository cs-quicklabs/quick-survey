class ApplicationController < ActionController::Base
  etag {
    if Rails.env == "production" or Rails.env == "staging"
      heroku_version
    else
      current_user.permission
    end
  }

  fragment_cache_key do
    current_user.permission
  end

  def heroku_version
    ENV["HEROKU_RELEASE_VERSION"] if Rails.env == "production" or Rails.env == "staging"
  end
end
