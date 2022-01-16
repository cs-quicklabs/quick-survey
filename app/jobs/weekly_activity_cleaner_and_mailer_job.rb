class WeeklyActivityCleanerAndMailerJob < ApplicationJob
  def perform
    ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_attempts RESTART IDENTITY")
    ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_participant RESTART IDENTITY")
    ActiveRecord::Base.connection.execute("TRUNCATE TABLE survey_answers RESTART IDENTITY")
  end
end
