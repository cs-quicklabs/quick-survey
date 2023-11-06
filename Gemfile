source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.2.2"

# Bundle edge Rails instead: gem 'rails', [https://github.com/rails/rails]
gem "rails", "7.1.1"

gem "propshaft"

# Use postgresql as the database for Active Record
gem "pg"

# Use Puma as the app server [https://github.com/puma/puma]
gem "puma", "6.4.0"

# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "jsbundling-rails", "1.2.1"

# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "cssbundling-rails", "1.3.3"

# Hotwire's SPA-like page accelerator [https://github.com/hotwired/turbo-rails]
gem "turbo-rails", "1.5.0"

# Hotwire's modest JavaScript framework [https://github.com/hotwired/stimulus-rails]
gem "stimulus-rails", "1.3.0"

gem "devise"
gem "devise_invitable", "~> 2.0.9"
gem "devise-pwned_password"

gem "draper"
gem "letter_opener_web", group: :development

# Use Active Storage variant
# gem 'image_processing', '~> 1.2'
gem "wicked_pdf", github: "mileszs/wicked_pdf", branch: "master"
gem "wkhtmltopdf-binary"
gem "json"
gem "pagy"
gem "htmlbeautifier"

# Reduces boot times through caching; required in config/boot.rb
gem "acts_as_tenant"
gem "bootsnap", "1.17.0", require: false
gem "rails-patterns"
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
  gem "rack-mini-profiler", "~> 3.1"
  gem "listen", "~> 3.3"
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  #   gem "spring"
end

group :test do
  # Adds support for Capybara system testing and selenium driver
  gem "capybara", ">= 3.38"
  gem "selenium-webdriver"
  # Easy installation and use of web drivers to run system tests with browsers
  gem "webdrivers"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem "good_job", "~> 3.19"
