# Load the Rails application.
require_relative "application"

# Initialize the Rails application.
Rails.application.initialize!

ActionMailer::Base.smtp_settings = {
  :user_name => "apikey", # This is the string literal 'apikey', NOT the ID of your API key
  :password => "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", # This is the secret sendgrid API key which was issued during API key creation
  :domain => "https://www.quicklabs.in",
  :address => "smtp.sendgrid.net",
  :port => 587,
  :authentication => :plain,
  :enable_starttls_auto => true,
}
