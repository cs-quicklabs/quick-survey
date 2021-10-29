desc "This task is called by the Heroku scheduler add-on"
task :clear_data => :environment do
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_attempts RESTART IDENTITY")
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_participant RESTART IDENTITY")
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_answers RESTART IDENTITY")
end
