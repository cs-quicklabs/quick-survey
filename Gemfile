source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.0.2"
# Bundle edge Rails instead: gem 'rails', [https://github.com/rails/rails]
gem "rails", "7.0.0"

# The original asset pipeline for Rails [https://github.com/rails/sprockets-rails]
gem "sprockets-rails", "3.4.2"
gem 'devise_invitable', '~> 2.0.0'
# Use postgresql as the database for Active Record
gem "pg", "1.2.3"
gem "draper"
# Use Puma as the app server [https://github.com/puma/puma]
gem "puma", "5.5.1"
gem "devise", github: "ghiculescu/devise", branch: "patch-2"
# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "jsbundling-rails", "1.0.0"
gem "devise-pwned_password"
gem 'letter_opener_web', group: :development
# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "cssbundling-rails", "1.0.0"

# Hotwire's SPA-like page accelerator [https://github.com/hotwired/turbo-rails]
gem "turbo-rails", "1.0.0"

# Hotwire's modest JavaScript framework [https://github.com/hotwired/stimulus-rails]
gem "stimulus-rails", "1.0.0"
gem "pundit"
# Build reactive applications [https://github.com/stimulusreflex/stimulus_reflex]
gem "stimulus_reflex", "= 3.5.0.pre8"
# Use Active Storage variant
# gem 'image_processing', '~> 1.2'
gem "wicked_pdf", github: "mileszs/wicked_pdf", branch: "master"
gem "wkhtmltopdf-binary"
gem "redis", ">= 4.0", :require => ["redis", "redis/connection/hiredis"]
gem "hiredis"
gem "json"
gem "pagy"

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.4", require: false
gem "rexml"
group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
end

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem "web-console", ">= 4.1.0"
  # Display performance information such as SQL time and flame graphs for each request in your browser.
  # Can be configured to work on production as well see: https://github.com/MiniProfiler/rack-mini-profiler/blob/master/README.md
  gem "rack-mini-profiler", "~> 2.0"
  gem "listen", "~> 3.3"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem "spring"
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", ">= 3.26"
  gem "selenium-webdriver"
  # Easy installation and use of web drivers to run system tests with browsers
  gem "webdrivers"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

