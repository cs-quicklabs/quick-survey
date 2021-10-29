desc "This task is called by the Heroku scheduler add-on"
task :clear_data => :environment do
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_attempts")
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_participant")
  ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_answers")
end
